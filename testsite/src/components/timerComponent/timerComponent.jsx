import React, { Component } from 'react'
class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        const { questionMinutes, questionSeconds, questionGroupMinutes, questionGroupSeconds } = this.props;
        return (
            <div>
                <div>
                    <h2>Таймер вопроса:{questionMinutes}:{questionSeconds}.</h2>
                </div>
                <div>
                    <h2>Таймер группы{questionGroupMinutes}:{questionGroupSeconds}.</h2>
                </div>
            </div>
        );
    }

}
export default Timer;