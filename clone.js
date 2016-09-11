var request = require('request');
var https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var key = "";
var num=5567
var auth="Basic YWRtaW46TmV0YXBwMSE="
var masterKey="d014ace2-6f03-11e6-8b3b-4d8e0894f7d7:type=volume,uuid=206b0cfe-c2a6-44d8-a1d2-b8a43f715b11"
var cloneName="clone"+num
var policyKey="d014ace2-6f03-11e6-8b3b-4d8e0894f7d7:type=export_policy,uuid=8589934609"

clone(masterKey);
setTimeout(function(){getKey(cloneName,policy);},3000)
setTimeout(function(){getKey(cloneName,mount);},4000)

function clone(key) {
    // mount on junction path
  console.log("FLEX CLONING...");
  request(    
  {
    url : "https://52.32.148.251:8443/api/1.0/ontap/volumes/"+key+'/jobs/clone',
    json : { 
        "volume_clone_name":cloneName},
    headers : { "Authorization" :auth} ,
    method : "POST" 
  },
  function (error, response, body) {
    console.log("Flex clone error? "+"clone"+num);
    console.log(error); 
  }
  );
}

function getKey(name,callback) {
// get volume key
request(   
{
url : "https://52.32.148.251:8443/api/1.0/ontap/volumes?name="+name,
headers : { "Authorization" : auth}  
},
function (error, response, body) {
  console.log("GETTING VOLUMNE KEY...");
  body=JSON.parse(body);
  key=body.result.records[0].key;
  console.log(key); 
  callback(key);
});
}

function policy(key) {
    // set export policy
  console.log("SETTING EXPORT POLICY");
  request(    
  {
    url : "https://52.32.148.251:8443/api/1.0/ontap/volumes/"+key,
    json : { 
        "export_policy_key" : policyKey },
    headers : { "Authorization" :auth} ,
    method : "PUT" 
  },
  function (error, response, body) {
    console.log("error="+error); 
  }
  );
}

function mount(key) {
    // mount on junction path
  console.log("JUNCTION PATH...");
  request(    
  {
    url : "https://52.32.148.251:8443/api/1.0/ontap/volumes/"+key+'/jobs/mount',
    json : { 
        "junction_path":"/clone"+num},
    headers : { "Authorization" :auth} ,
    method : "POST" 
  },
  function (error, response, body) {
    console.log("MOUNTING ON JUNCTION PATH");
    console.log(error); 
  }
  );
}







