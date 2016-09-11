cloneNum = $RANDOM
curl 'https://52.32.148.251:8443/api/1.0/ontap/volumes/d014ace2-6f03-11e6-8b3b-4d8e0894f7d7%3Atype%3Dvolume%2Cuuid%3D206b0cfe-c2a6-44d8-a1d2-b8a43f715b11/jobs/clone' -H 'Origin: https://52.32.148.251:8443' -H 'Authorization: Basic YWRtaW46TmV0YXBwMSE=' -H 'Content-Type: application/json' -H 'Accept: application/json' --data-binary $'{\n  "volume_clone_name": "clone-'$RANDOM'"\n}' --compressed --insecure
sleep 3
