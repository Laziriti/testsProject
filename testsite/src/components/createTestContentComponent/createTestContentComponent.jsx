import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Grid, GridColumn } from 'semantic-ui-react';
// import '../../indexStyles.css';
// import './style.css';

import OneVariantQuestion from '../oneVariantQuestionComponent/oneVariantQuestionContainer';
import ManyVariantQuestion from '../manyVariantsQuestionComponent/manyVariantsQuestionContainer';
import SequenceQuestion from '../sequenceQuestionComponent/sequenceQuestionContainer'
import WriteByYourselfQuestion from '../writeByYourselfQuestionCompoent/writeByYourselfQuestionContainer';
import TestResults from '../testResultsComponent/testResultsContainer';

class createTestContentComponent extends Component {
   

    render() {

        const {
            testType,
            results } = this.props
        return (
            <div className="triggerDiv">
                <div className="triggerDivItem">
                    <OneVariantQuestion
                        groupsState={this.props.groupsState}
                        groupsTimerState={this.props.groupsTimerState}
                        setGroups={this.props.setGroups}
                        handleGroups={this.props.handleGroups}
                        updateList={this.props.updateList}
                        firstTypeHandler={this.props.firstTypeHandler}
                        secondTypeHandler={this.props.secondTypeHandler} />
                </div>

                {testType === 'third' ? "" :
                    <div className="triggerDivItem">
                        <ManyVariantQuestion
                            groupsState={this.props.groupsState}
                            groupsTimerState={this.props.groupsTimerState}
                            setGroups={this.props.setGroups}
                            handleGroups={this.props.handleGroups}
                            updateList={this.props.updateList}
                            firstTypeHandler={this.props.firstTypeHandler} 
                            secondTypeHandler={this.props.secondTypeHandler}/>
                    </div>}
                {
                    testType === 'second' || testType === 'third' ?
                        ""
                        : <div className="triggerDivItem">
                            <SequenceQuestion
                                groupsState={this.props.groupsState}
                                groupsTimerState={this.props.groupsTimerState}
                                setGroups={this.props.setGroups}
                                handleGroups={this.props.handleGroups}
                                updateList={this.props.updateList} />
                        </div>
                }
                {
                    testType === 'second' || testType === 'third' ?
                        ""
                        : <div className="triggerDivItem">
                            <WriteByYourselfQuestion
                                groupsState={this.props.groupsState}
                                groupsTimerState={this.props.groupsTimerState}
                                setGroups={this.props.setGroups}
                                handleGroups={this.props.handleGroups}
                                updateList={this.props.updateList} />
                        </div>
                }
                <div className="triggerDivItem">
                    <TestResults editResults={results} groupResultsState={this.props.groupResultsState} />
                </div>
            </div>
        )
    }
}

export default (createTestContentComponent)