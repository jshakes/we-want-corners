const styleEl = document.createElement( 'style' );
document.head.appendChild( styleEl );

const getHost = url => url.match( /^(?:\/\/|[^\/]+)*/ )[ 0 ];
const addRule = () => styleEl.sheet.insertRule( '* { border-radius: 0 !important }', 0 );
const removeRule = () => styleEl.sheet.deleteRule( 0 );

const getWhiteList = () => {
	return new Promise( resolve => {
		chrome.storage.local.get( [ 'whitelist' ], ( { whitelist } ) => resolve( whitelist || [] ) );
	} );
};

const thisHostBlocklisted = ( whitelist = [] ) => whitelist.includes( `${window.location.protocol}//${window.location.host}` );

getWhiteList().then( whitelist => thisHostBlocklisted( whitelist ) || addRule() );
chrome.storage.onChanged.addListener( ( { whitelist } ) => {
	if ( thisHostBlocklisted( whitelist?.newValue ) ) {
		removeRule();
	} else {
		addRule();
	}
} );
