const AddToHomeScreen = ( () => {

  const isWebAppSafari = ( ( 'standalone' in window.navigator ) && window.navigator.standalone );
  // const isWebAppChrome = ( window.matchMedia( '(display-mode: standalone)' ).matches );
  const isNotificationClosed = ( localStorage.getItem( 'theCube_closeNotification' ) == 'true' );

  if ( ! isWebAppSafari && ! isNotificationClosed ) {

    const notification = document.querySelector( '.ui__notification' );

    window.setTimeout( () => notification.classList.add( 'is-active' ), 2000 );

    notification.onclick = e => {

      e.preventDefault();
      notification.classList.remove( 'is-active' );
      localStorage.setItem( 'theCube_closeNotification', 'true' );

    }

  }

} )();

export { AddToHomeScreen };
