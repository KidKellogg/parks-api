'use strict';
//https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=atSuWzxQfFp3Bzu6O9BWqtcfOeXeHJZ0iwqLwSHE

const apiKey = 'atSuWzxQfFp3Bzu6O9BWqtcfOeXeHJZ0iwqLwSHE'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  $('#js-error-message').html('');
  $('.results-js').html('');
  console.log(responseJson);
  // iterate through the items array
  if (responseJson.data.length < 1) {
    $('.results-js').append(
        `<h3>Sorry, that state doesn't have any parks.</h3><hr>`
      )
  }

  else {
  for (let i = 0; i < responseJson.data.length; i++){
      
    $('.results-js').append(
      `<h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a class="link result" href="${responseJson.data[i].url}">Visit the website!</a>
      <p>Address:</p>
      <p>${responseJson.data[i].addresses[i].line1} ${responseJson.data[i].addresses[i].line2} ${responseJson.data[i].addresses[i].line3}</p>
      <p>${responseJson.data[i].addresses[i].city}, ${responseJson.data[i].addresses[i].stateCode} ${responseJson.data[i].addresses[i].postalCode}</p>
      <hr>`
    )};
  }
  //display the results section  
  $('.results').removeClass('hidden');
};

function getParks(code, limit=10) {
  const params = {
    api_key: apiKey,
    stateCode: code,
    limit
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('.js-search-term').val().replace(/\s/g, '');
    const limit = $('.js-max-results').val();
    getParks(searchTerm, limit);
  });
}

$(watchForm);