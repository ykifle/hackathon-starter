$(document).ready(function() {

  // Place JavaScript code here...
  $('#submit-disclosures').on('click', function() {
    console.log('Submiting form');
    $.post('/listing/1/disclosures').done(function(data, status, jqXHR) {
      console.log('Submiting form success');
      if (data['disclosureDocumentToken']) {
        console.log('disclosureDocumentToken=' + data['disclosureDocumentToken']);
        localStorage.setItem('disclosureDocumentToken', data['disclosureDocumentToken']);
      }
      window.location = '/listing/1/disclosures/review';
    });
  });
});