import React from 'react';
import './MusicPanel.css'
import { ReactComponent as PlayIcon } from '../assets/icons/play.svg';

class MusicPanel extends React.Component {
    render() {
        return (
            <div className="music-panel">
                <img src={require(`../assets/Covers/${this.props.cover}`)} className="music-cover" alt="Cover" />
                <div className="music-panel-play">
                    <PlayIcon className="music-panel-play-icon" />
                </div>
            </div>
        )
    }
}

export default MusicPanel