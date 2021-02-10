import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AppContext } from './ContextProvider';
import HuntListItem from './HuntListItem';


const HuntsListPage = props => {
    // deconstruct huntList and setHuntList from context 
    const {
      hunts, 
      setHunts,
      potentialHunts,
      setPotentialHunts,
      runningHunts,
      setRunningHunts,
      completedHunts,
      setCompletedHunts,
      user,
      userLat,
      userLng,
    } = useContext(AppContext);

    /**
     * useEffect hook 
     * axios call to get top hunts  
     * setHuntList  
     * 2nd arg should be user location  
     */
    
    // const userCoords = {
    //   userLat,
    //   userLng,
    // }

    // useEffect(() => {
    //   // TODO confirm endpoint
    //   axios(`http://localhost:3000/api/hunts`)
    //   // TODO determine if the data is already sorted by votes -- if not, sort 
    //     .then(res => {
          
    //       setHunts(res.data.map(hunt => {
    //         return  {
    //           ...hunt,
    //           pos: {
    //             lat: hunt.lat,
    //             lng: hunt.lng,
    //           }
    //         }
    //       }))
    //     })
    //     .catch(err => console.log('GET Error retrieving all hunts in the area'))
    // }, [])

// DUMMY OBJECT
    const huntsTest = [
    {
      hunt_id: 1,
      hunt_name: 'Chris D Austin Ultimate',
      hunt_votes: 65,
      hunt_pplGoing: 12,
      hunt_splash: '',
      lat: 30.2674331,
      lng: -97.7419488,
      // FIXME is there a separate hunt row entry for every user? 
      // user who made the hunt 
      user_id: 1234,
    },
    {
      hunt_id: 2,
      hunt_name: 'South by Southwest',
      hunt_votes: 50,
      hunt_pplGoing: 7,
      hunt_splash: '',
      lat: 30.2674331,
      lng: -97.7453488,
      // FIXME is there a separate hunt row entry for every user? 
      // user who made the hunt 
      user_id: 1234,
    },
]
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.API_KEY
        
    });


    const [map, setMap] = useState(null);

    const center = {
      lat: 30.2674331,
      lng: -97.7419488
    }

    const onMapLoad = useCallback(map => {
      setMap(map);
  }, []);

    const onMapUnmount = useCallback(map => {
      setMap(null);
    }, [])
    

    const [infoWindow, setInfoWindow] = useState([]);
    
    const huntItemClickHandler = (pos, huntName) => {
      console.log('position', pos);
      return setInfoWindow(
        // FIXME infoWindow doesn't open back up after being closed
        <InfoWindow position={pos}>
          <div className="huntMapInfo">
            <h4 className="huntMapInfoName">{huntName}</h4>
            {/* <div>{hunt.hunt_pplGoing} People Going!</div>
            <div>{hunt.hunt_votes} Total Votes!</div> */}
          </div> 
        </InfoWindow>
      );
    }


    

    // declare empty huntList array 
    const huntList = [];
    // loop and push to array a HuntListItem component 
    // TODO switch back to hunts Context array
    huntsTest.forEach(huntObj => {
      huntList.push(
        <HuntListItem
        className=""
        key={huntObj.hunt_id}
        huntId={huntObj.hunt_id}
        huntName={huntObj.hunt_name}
        voteCount={huntObj.hunt_votes}
        pplGoing={huntObj.hunt_pplGoing}
        pos={huntObj.pos}
        linkTo={'/hunt/' + huntObj.hunt_id}
        huntItemClickHandler={huntItemClickHandler}
        >
        </HuntListItem>
      )
    })


    return(
      <div className='huntListContainer'>
        <h1>Scavenger Hunts in Your Area!</h1>
          {
            isLoaded ?
                <GoogleMap zoom={16} mapContainerStyle={{ height: '500px', width: '100%' }} center={center} onLoad={onMapLoad} onUnmount={onMapUnmount}>
                    {/* Load Markers */}
                    {
                        huntsTest.map(hunt => (
                          <div>
                          <Marker position={hunt.pos}/>
                          </div>
                          ))
                          
                          
                    }
                  {infoWindow}
                </GoogleMap>
                : <p>loading map...</p>
          }
        <div className='list-item-section'>{huntList}</div>
      </div>
    );

}

export default HuntsListPage;