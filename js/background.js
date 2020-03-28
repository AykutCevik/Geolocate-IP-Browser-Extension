chrome.browserAction.setBadgeText({text: '(ツ)'});
chrome.browserAction.setBadgeBackgroundColor({color: '#eae'});

chrome.browserAction.onClicked.addListener(function(aTab) {
  //chrome.tabs.create({'url': 'http://chilloutandwatchsomecatgifs.com/', 'active': true});

  //myreq = new Request("https://airvpn.org/api/whatismyip/");
  fetch("https://airvpn.org/api/whatismyip/")
    .then( data => {
        return data.json()
      }
    )
    .then( res  => {
        console.log(res)
        console.log(res.ip)
        console.log(res.geo.code)
        console.log(res.geo.name)
      }
    )

//here ends chrome function
});
