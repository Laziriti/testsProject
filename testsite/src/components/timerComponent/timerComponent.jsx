import React, { Component } from 'react'
import "./style.css"
class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        const { questionMinutes, questionSeconds, questionGroupMinutes, questionGroupSeconds } = this.props;
        return (
            <div className="timer-block">
                {(questionGroupMinutes !== 0 || questionGroupSeconds !== 0) ?
                    <div className="timer-block__content">
                        <h2>Таймер группы: {questionGroupMinutes}:{questionGroupSeconds}</h2>
                    </div>
                    : ""
                }
                {(Number(questionMinutes) !== 0 || Number(questionSeconds) !== 0) ?
                    <div className="timer-block__content">
                        <h2>Таймер вопроса: {questionMinutes}:{questionSeconds}</h2>
                    </div>
                    : ""
                }

            </div>
        );
    }

}
export default Timer;