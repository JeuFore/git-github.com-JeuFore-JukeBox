import React from 'react';
import { Progress, Slider } from 'rsuite';
import MusicPanel from './Components/MusicPanel';

import { ReactComponent as PauseIcon } from './assets/icons/pause.svg';
import { ReactComponent as PlayIcon } from './assets/icons/play.svg';
import { ReactComponent as SkipForwardIcon } from './assets/icons/skip-forward.svg';
import { ReactComponent as SkipBackIcon } from './assets/icons/skip-back.svg';

import Musics from './assets/Musics.json';

class AudioPage extends React.Component {
    constructor() {
        super();
        this.state = {
            playMusic: false,
            playTime: 0,
            currentMusic: {}
        }
        this.musicList = []
        this.musicInterval = null;
        this._changeMusicStatus = this._changeMusicStatus.bind(this);
        this._nextTrack = this._nextTrack.bind(this);
        this._previousTrack = this._previousTrack.bind(this);
        this._playMusic = this._playMusic.bind(this);
        this._stopMusic = this._stopMusic.bind(this);
        this._seekbackward = this._seekbackward.bind(this);
        this._seekforward = this._seekforward.bind(this);
        navigator.mediaSession.setActionHandler('play', this._playMusic);
        navigator.mediaSession.setActionHandler('pause', this._stopMusic);
        navigator.mediaSession.setActionHandler('seekbackward', this._seekbackward);
        navigator.mediaSession.setActionHandler('seekforward', this._seekforward);
        navigator.mediaSession.setActionHandler('previoustrack', this._previousTrack);
        navigator.mediaSession.setActionHandler('nexttrack', this._nextTrack);
    }

    componentDidMount() {
        Musics.map((data) => {
            return this.musicList.push(data);
        })
        this.music = new Audio(require(`./assets/Songs/${this.musicList[0].path}`));
        console.log(this.music.getAttribute('title'))
        this.setState({
            currentMusic: this.musicList[0]
        })
    }

    _setMetadata() {
        if ('mediaSession' in navigator)
            navigator.mediaSession.metadata = new window.MediaMetadata({
                title: this.state.currentMusic.title,
                artist: this.state.currentMusic.artist,
                album: this.state.currentMusic.album,
                artwork: [{ src: require(`./assets/Covers/${this.state.currentMusic.cover}`), sizes: '512x512', type: 'image/jpg' }]
            });
    }

    _changeMusicStatus() {
        if (this.state.playMusic)
            this._stopMusic();
        else
            this._playMusic();
        this.setState({
            playMusic: !this.state.playMusic
        })
    }

    _stopMusic() {
        this.music.pause();
        this.setState({
            playMusic: false
        })
        clearInterval(this.musicInterval)
    }

    _playMusic() {
        this._setMetadata();
        this.music.play()
        this.setState({
            playMusic: true
        })
        this.musicInterval = setInterval(() => {
            this.setState({
                playTime: this.music.currentTime / this.music.duration * 100
            })
        }, 1000);
        this.music.addEventListener('ended', () => this._nextTrack())
    }

    _nextTrack() {
        const id = this.musicList.length - 1 === this.state.currentMusic.id ? 0 : this.state.currentMusic.id + 1
        this.setState({
            currentMusic: this.musicList[id]
        })
        this.music.src = require(`./assets/Songs/${this.state.currentMusic.path}`)
        this.music.load();
        this._playMusic();
    }

    _previousTrack() {
        const id = 0 === this.state.currentMusic.id ? this.musicList.length - 1 : this.state.currentMusic.id - 1
        this.setState({
            currentMusic: this.musicList[id]
        })
        this.music.src = require(`./assets/Songs/${this.state.currentMusic.path}`)
        this.music.load();
        this._playMusic();
    }

    _seekbackward() {
        this.music.currentTime -= 10;
    }

    _seekforward() {
        this.music.currentTime += 10;
    }

    render() {
        return (
            <div className="player">
                <div style={{ display: 'flex' }}>
                    <SkipBackIcon onClick={this._previousTrack} className="status-button" />
                    {this.state.playMusic ? <PauseIcon onClick={this._stopMusic} className="status-button" /> : <PlayIcon onClick={this._playMusic} className="status-button" />}
                    <SkipForwardIcon onClick={this._nextTrack} className="status-button" />
                </div>

                <div className="header">
                    <div className="music-panel-grid">
                        {Musics.map(({ id, title, artist, album, cover }) => <MusicPanel key={id} title={title} artist={artist} album={album} cover={cover} />)}
                    </div>
                </div>

                <Progress.Line percent={this.state.playTime} status='active' showInfo={false} style={{ width: 512 }} />

                <Slider progress value={this.state.playTime} onChange={value => { console.log(value) }} style={{ width: 512 }} />

                {this.state.currentMusic.cover && (
                    <img src={require(`./assets/Covers/${this.state.currentMusic.cover}`)} alt="" />
                )}
            </div>
        )
    }
}

export default AudioPage