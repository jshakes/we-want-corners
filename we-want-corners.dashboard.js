const getHost = url => url.match( /^(?:\/\/|[^\/]+)*/ )[ 0 ];

const getWhiteList = () => {
	return new Promise( resolve => {
		chrome.storage.local.get( [ 'whitelist' ], ( { whitelist } ) => resolve( whitelist || [] ) );
	} );
};

const addToWhiteList = host => {
	return new Promise( resolve => {
		getWhiteList()
			.then( whitelist => {
				chrome.storage.local.set( {
					whitelist: [ ...whitelist, host ],
				}, resolve );
			} );
	} );
};

const removeFromWhiteList = host => {
	return new Promise( resolve => {
		getWhiteList()
			.then( whitelist => {
				chrome.storage.local.set( {
					whitelist: whitelist.filter( whiteListedHost => whiteListedHost !== host ),
				}, resolve );
			} );
	} );
};

document.addEventListener( 'DOMContentLoaded', () => {
	chrome.tabs.query( { active: true }, tabs => {
		const currentHost = getHost( tabs[ 0 ].url );
		const checkBox = document.getElementById( 'disable-site' );
		const thisSiteEl = document.getElementById( 'this-site' );

		// Populate UI with host name
		thisSiteEl.innerHTML = currentHost;

		// Should the checkbox be checked?
		getWhiteList()
			.then( whitelist => {
				if ( whitelist.includes( currentHost ) ) {
					checkBox.checked = true;
				}
			} );

		// Listen to checkbox change
		checkBox.addEventListener( 'change', e => {			
			if ( e.currentTarget.checked ) {
				addToWhiteList( currentHost );
			} else {
				removeFromWhiteList( currentHost );
			}
		} );
	} );
} );
