import { Alert, Backdrop, Box, Button, Chip, CircularProgress, Divider, FormGroup, Grid, Menu, MenuItem, Snackbar, Typography } from '@mui/material'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import SearchInput from '../components/SearchInput'
import { gtag, install } from 'ga-gtag';
import { useEffect, useState } from 'react'
import {  PianoOutlined, SortByAlphaRounded, SortRounded, UploadFile } from '@mui/icons-material';
import { useRouter } from 'next/router'
import UploadTrack from '../components/UploadTrack'
import TrackCard from '../components/TrackCard'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Header from '../components/Header'
import dynamic from 'next/dynamic'
import {Player} from 'react-simple-player';

const SpotifyWebPlayer = dynamic(() => import('react-spotify-web-playback'), {
  loading: () => 'Loading...',
  ssr: false,
})

export default function Search({ tracksDetails,loginResp }) {
  console.log(tracksDetails)
  const router = useRouter()
  const [isFetching, setIsFetching] = useState(true);
  const [sortType, setSortType] = useState('popularity');
  const [tracksData, setTracksData] = useState(tracksDetails || []) 
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [notification, setNotification] = useState({ type: null, message: ""});
  const [anchorEl, setAnchorEl] = useState(null);
  const [token, setToken] = useState(loginResp ? loginResp?.token : null);
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState(null);

  const handlePlayTrack = (event, track) => {
    event.preventDefault();
    setCurrentPlayingTrack(track);
  }

  const handleClosePlayer = () => {
    setCurrentPlayingTrack(null)
  }


  const open = Boolean(anchorEl);
  const handleOpenSortBy = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  
  useEffect(() => {
    install('G-LDDJ32MXZ1'); 
    setTracksData(tracksDetails);
    setIsFetching(false);
  }, [router.query.query, router.asPath, tracksDetails])

  const handleNewSearch = (isFetching) => {
    //setIsFetching(isFetching)
  }
      
  const showNotification = (type, message) => {
    setSnackbarOpen(true);
    setNotification({
        type: type,
        message
    })
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };
  

  const selectTrack = (url, track) => {
    setTracksData(null)
    setIsFetching(true);
    router.push(url)
  }
  
  const handleSort = (type) => {
    setSortType(type);
    const tmp = tracksData;
    if(tmp.length > 0) {
      let sorted = tmp.slice(0);
      sorted.sort(function(a,b) {
          return a[type] - b[type];
      });
      setTracksData(sorted);
    }
  }

  return (
    <div lang="en" className={styles.container}>
      <Head> 
        <title>BPM, Song Key of track {router.query.query}, Similar songs Harmonic Mixing</title>
        <meta name="description" content={`BPM, Song Key Results of track ${router.query.query}, similar songs, bpm counter, bpm calculator, Find song tempo, What bpm is this`} />
        <link rel="icon" href="/favicon3.png" />
        <link rel="alternate" href="http://songkeyfinder.app" hrefLang="en"/>
        <meta name="keywords" content={`BPM, Song Key of track ${router.query.query}, song key finder, bpm tempo finder, similar tracks for mixing, , bpm counter, bpm calculator, bpm, Find song tempo, What bpm is this`} />
          <meta name="googlebot" content="index, follow" />
          <meta name="robots" content="index, follow" />
          <link rel="apple-touch-icon-precomposed" href="/favicon3.png" />
          <link rel="shortcut icon" href="/favicon3.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Song key & Tempo BPM Finder Tool" />
          <meta name="twitter:description" content="Song key & Tempo BPM Finder and song analyzer Tool" />
          <meta name="twitter:image:src" content="/favicon3.png" />
          {/*<meta property="fb:admins" content="100002861414139">
          <meta property="fb:app_id" content="503426229739677">*/}
          <meta property="og:url" content="https://songkeyfinder.app" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content="Song key & Tempo BPM Finder Tool" />
          <meta property="og:image" content="/favicon3.png"/>
          <meta property="og:description" content="NO ADS / NO BULLSHIT!!"/>
          <meta property="og:site_name" content="songkeyfinder.app" />
          <meta itemProp="name" content="Song key & Tempo BPM Finder Tool" />
          <meta itemProp="description" content="Song key & Tempo BPM Finder Tool" />
          <meta itemProp="image" content="./favicon3.png" />
      </Head>
      <main lang="en" className={styles.main}>
        <Header />
        <SearchInput handleNewSearch={handleNewSearch} isSearching={isFetching} />
        {!tracksDetails && <Box sx={{ maxWidth: '768px',width: '100%', mt: '25px' }}>
          <Typography sx={{fontSize: '24px', width: '100%'}} variant="h5">Ooppss!! We could not find any data from out database for the keyword ${router.query.query}</Typography>
        </Box>} 
        {(tracksData && tracksData.length > 0) && 
          <Box sx={{ maxWidth: '768px',width: '100%', mt: '25px' }}>
              <Grid  spacing={2}>
                  <Grid xs={12} mt={4} mb={1}>
                          <Typography sx={{fontSize: '24px', width: '100%'}} variant="h5">BPM, Song Key Results of {router.query.query}</Typography>
                  </Grid>
                  <Grid xs={4} sm={4} md={6}>
                      <Typography style={{ width: '100%',textAlign: 'left', padding: '0', opacity: 0.4}} variant="subtitle2"><b>({tracksData.length})</b> results found via spotify API</Typography>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} mb={4} mt={2}>
                    <Button
                      color={'info'}
                      startIcon={<SortRounded />}
                      aria-controls={open ? 'fade-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleOpenSortBy}
                    >
                      Sorted By: {sortType} <ArrowDropDownIcon size={'small'} />
                    </Button>
                    <Menu
                      id="fade-menu"
                      MenuListProps={{
                        'aria-labelledby': 'fade-button',
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => handleSort('popularity')}>Sort By Popularity</MenuItem>
                  <MenuItem onClick={() => handleSort('key')}>Sort By Key</MenuItem>
                  <MenuItem onClick={() => handleSort('tempo')}>Sort By Tempo</MenuItem>
                  <MenuItem onClick={() => handleSort('time_signature')}>Sort By Beat</MenuItem>
                  <MenuItem onClick={() => handleSort('happiness')}>Sort By Happiness</MenuItem>
                  <MenuItem onClick={() => handleSort('energy')}>Sort By Energy</MenuItem>
                  <MenuItem onClick={() => handleSort('danceability')}>Sort By Danceability</MenuItem>

                    </Menu>
                  </Grid>
                  
                  {tracksData.map((track, index) => {
                      return (<TrackCard handlePlayTrack={handlePlayTrack} onSelectTrack={selectTrack} key={'tr-'+index} track={track} />) })}
              </Grid>
          </Box>}

           <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={notification.type || 'error'} sx={{ width: '100%' }}>
                    {notification.message || ''}
                </Alert>
            </Snackbar>
            
            {isFetching && <Backdrop
                sx={{ color: '#fff', textAlign: 'center', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isFetching}
                >
                <CircularProgress color="inherit" />
            </Backdrop>}

            {(currentPlayingTrack !== null) && <Box sx={{position: 'fixed !important', display: 'flex', padding: '10px 0 10px 10px', background: 'rgb(246, 248, 250)',  borderTop: '1px solid #ddd', bottom: '0px', left: 0, width: '100%'}} >
              <Image unoptimized alt={'playerPhoto'+currentPlayingTrack.name} width={85} height={50} src={currentPlayingTrack.album?.images[0] && currentPlayingTrack.album.images[0].url} />
              <Player autoPlay src={currentPlayingTrack.preview_url} height={80} />
            </Box>
            }
        <UploadTrack />
      </main>
    </div>
  )
}


// This function gets called at build time
export async function getServerSideProps({ params }) {
  // Call an external API endpoint to get posts
  const login = await fetch('https://songkeyfinder.app/api/authSpotify')

  if(!login || login.length < 1) {
    return {
      redirect: {
        destination: "/api/authSpotify",
      },
    }
  }

  const loginResp = await login.json();

  const searchResult = await fetch('https://songkeyfinder.app/api/findBpm?title='+params.query)
  const tracksData = await searchResult.json();
  
  if(tracksData.err) {
    if(tracksData.err === "AUTHORIZATION_REQUIRED") {
      return {
        redirect: {
          destination: "/api/authSpotify",
        },
      }
    } else {
      return {
        props: {
          tracksDetails: null,
          loginResp: tracksData.err
        },
      }
    }
  } else {
    return {
      props: {
        tracksDetails: tracksData,
        loginResp: loginResp
      },
    }
  }
}
