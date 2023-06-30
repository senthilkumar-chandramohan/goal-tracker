import { useState, useEffect } from 'react'
import MainScreen from './MainScreen'
import { GoogleLoginContext } from './GoogleLoginContext'

const GoogleLogin = () => {
    const gapi = window.gapi
    const google = window.google
    
    const CLIENT_ID = '639013570093-ra815s87u0n7amagucs2b7mf3pdhhgmg.apps.googleusercontent.com'
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
    const SCOPES = 'https://www.googleapis.com/auth/calendar'

    const accessToken = localStorage.getItem('access_token')
    const expiresIn = localStorage.getItem('expires_in')

    let gapiInited = false, gisInited = false, tokenClient

    const listUpcomingEvents = async () => {
        let response;
        try {
            const request = {
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime',
            }

            setTimeout(async () => {
                response = await gapi.client.calendar.events.list(request)
                return response.result.items
            }, 500);
        } catch (err) {
            // document.getElementById('content').innerText = err.message
            console.log(err)
            return null
        }
    
        // if (!events || events.length === 0) {
        //   document.getElementById('content').innerText = 'No events found.';
        //   return;
        // }
        // // Flatten to string to display
        // const output = events.reduce(
        //   (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,'Events:\n');
        // document.getElementById('content').innerText = output;
    }

    const initializeGapiClient = async () => {
        await gapi.client.init({
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
    
        if (accessToken && expiresIn) {
          gapi.client.setToken({
            access_token: accessToken,
            expires_in: expiresIn,
          });
          // listUpcomingEvents();
        }
    }

    const gisLoaded = () => {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
    
        gisInited = true;
    }
      
    const gapiLoaded = () => {
        gapi.load('client', initializeGapiClient);
    }

    useEffect(() => {
        //const expiryTime = new Date().getTime() + expiresIn * 1000;
        gapiLoaded()
        gisLoaded()
    }, [])

    const handleAuthClick = () => {
        tokenClient.callback = async (resp) => {
          if (resp.error) {
            throw (resp);
          }
          await listUpcomingEvents();
          const { access_token, expires_in } = gapi.client.getToken();
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('expires_in', expires_in)
        };
    
        if (!(accessToken && expiresIn)) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({ prompt: '' });
        }
    }
    
    //Sign out the user upon button click.

    const handleSignoutClick = () => {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
            localStorage.clear();
        }
    }

    const addManualEvent = (summary, description, date) => {
        var event = {
          'kind': 'calendar#event',
          'summary': summary,
          'description': description,
          'start': {
            'dateTime': `${date}T00:00:00.000Z`,
            'timeZone': 'UTC'
          },
          'end': {
            'dateTime': '2023-06-18T00:30:00.000Z',
            'timeZone': 'UTC'
          },
          'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=1'
          ],
          'attendees': [
          ],
          'reminders': {
            'useDefault': true,
          },
          "guestsCanSeeOtherGuests": true,
        }
    
        var request = gapi.client.calendar.events.insert({'calendarId': 'primary','resource': event,'sendUpdates': 'all'});
        request.execute((event)=>{
            console.log(event)
            window.open(event.htmlLink)
        },(error)=>{
            console.error(error);
        });
    }

    const [ context, setContext ] = useState({ addManualEvent, handleSignoutClick, listUpcomingEvents })

    if (accessToken && expiresIn) {
       return (
            <GoogleLoginContext.Provider value={context}>
                <MainScreen />
            </GoogleLoginContext.Provider>
       )
    } else {
        return (
            <>
                <p>Please sign-in to your Google account and authorize access to your Calendar to continue...</p>
                <button id="authorize_button" onClick={handleAuthClick}>SignIn to Google</button>
            </>
        )
    }

    // return (
    //     <div>
    //         <button id="authorize_button" hidden={accessToken && expiresIn} onClick={handleAuthClick}>Authorize</button>
    //         <button id="signout_button" hidden={!accessToken && !expiresIn} onClick={handleSignoutClick}>Sign Out</button>
    //         <button id='add_manual_event' hidden={!accessToken && !expiresIn} onClick={addManualEvent}>Add Event</button>
    //         <pre id="content" style={{ whiteSpace: 'pre-wrap' }}></pre>
    //     </div>
    // )
}

export default GoogleLogin
