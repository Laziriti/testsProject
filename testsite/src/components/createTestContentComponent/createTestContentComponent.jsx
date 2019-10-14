import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Grid, GridColumn } from 'semantic-ui-react';
// import '../../indexStyles.css';
// import './style.css';
import './style.css';
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
            <div className="trigger-block">
            <div className="trigger-block__container">
                <div className="trigger-block__item">
                    <OneVariantQuestion
                        groupsState={this.props.groupsState}
                        groupsTimerState={this.props.groupsTimerState}
                        setGroups={this.props.setGroups}
                        handleGroups={this.props.handleGroups}
                        updateList={this.props.updateList}
                        firstTypeHandler={this.props.firstTypeHandler}
                        secondTypeHandler={this.props.secondTypeHandler} 
                        title="Одновариантный вопрос"
                        />
                </div>

                {testType === 'third' ? "" :
                    <div className="trigger-block__item">
                        <ManyVariantQuestion
                            groupsState={this.props.groupsState}
                            groupsTimerState={this.props.groupsTimerState}
                            setGroups={this.props.setGroups}
                            handleGroups={this.props.handleGroups}
                            updateList={this.props.updateList}
                            firstTypeHandler={this.props.firstTypeHandler}
                            secondTypeHandler={this.props.secondTypeHandler} 
                            title="Многовариантный вопрос"/>
                    </div>}
                {
                    testType === 'second' || testType === 'third' ?
                        ""
                        : <div className="trigger-block__item">
                            <SequenceQuestion
                                groupsState={this.props.groupsState}
                                groupsTimerState={this.props.groupsTimerState}
                                setGroups={this.props.setGroups}
                                handleGroups={this.props.handleGroups}
                                updateList={this.props.updateList} 
                                title="Последовательность"/>
                        </div>
                }
                {
                    testType === 'second' || testType === 'third' ?
                        ""
                        : <div className="trigger-block__item">
                            <WriteByYourselfQuestion
                                groupsState={this.props.groupsState}
                                groupsTimerState={this.props.groupsTimerState}
                                setGroups={this.props.setGroups}
                                handleGroups={this.props.handleGroups}
                                updateList={this.props.updateList} 
                                title="Самописный вопрос"
                                />
                        </div>
                }
                <div className="trigger-block__item">
                    <TestResults editResults={results} groupResultsState={this.props.groupResultsState} />
                </div>
            </div>
            </div>
        )
    }
}

export default (createTestContentComponent)