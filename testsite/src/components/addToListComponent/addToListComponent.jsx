import React, { Component } from 'react'
import { Card } from 'semantic-ui-react';
import VariantsInfo from '../variantsInfoListComponent/variantsInfoListContainer'
import './addToListStyle.css';

import OneVariantQuestion from '../oneVariantQuestionComponent/oneVariantQuestionContainer';
import ManyVariantQuestion from '../manyVariantsQuestionComponent/manyVariantsQuestionContainer';
import SequenceQuestion from '../sequenceQuestionComponent/sequenceQuestionContainer'
import WriteByYourselfQuestion from '../writeByYourselfQuestionCompoent/writeByYourselfQuestionContainer';

class mapQuest extends Component {
  deleteHandler(index, questions, setQuests) {
    questions.splice(index, 1);
    setQuests(questions);
  }
  render() {

    const { question,
      variants,
      setQuests,
      questions,
      index,
      group_number,
      updateList,
      type_question,
      questImg,
      setGroups,
      handleGroups,
      groupsState,
      groupsTimerState,

      editQuest
    } = this.props

    return (

      <Card>
        <Card.Content >
          <Card.Header>Вопрос {index + 1}: {question}</Card.Header>
          <img className="questImg" src={questImg} alt="" />
          <p>Варианты ответа:</p>
          {
            variants ? variants.map((variant, index) => <VariantsInfo key={index} {...variant} index={index} />) : ""
          }

          <button onClick={() => { this.deleteHandler(index, questions, setQuests); this.props.updateList() }}>удалить</button>
          {type_question === "one_answer" ?
            <OneVariantQuestion
              groupsState={groupsState}
              groupsTimerState={groupsTimerState}
              setGroups={setGroups}
              handleGroups={handleGroups}
              currentGroup={group_number}
              editQuest={editQuest}
              editIndex={index}
              updateList={updateList}
            />
            : ""}
          {type_question === "many_answers" ?
            <ManyVariantQuestion
              editQuest={editQuest}

              groupsState={groupsState}
              groupsTimerState={groupsTimerState}
              setGroups={setGroups}
              handleGroups={handleGroups}
              editIndex={index}
              updateList={updateList}
            />
            : ""}
          {type_question === "sequence_answer" ?
            <SequenceQuestion
              editQuest={editQuest}


              groupsState={groupsState}
              groupsTimerState={groupsTimerState}
              setGroups={setGroups}
              handleGroups={handleGroups}
              editIndex={index}
              updateList={updateList}
            />
            : ""}
          {type_question === "write_by_yourself_answer" ?
            <WriteByYourselfQuestion
              editQuest={editQuest}


              groupsState={groupsState}
              groupsTimerState={groupsTimerState}
              setGroups={setGroups}
              handleGroups={handleGroups}
              editIndex={index}
              updateList={updateList}
            />
            : ""}
        </Card.Content>
      </Card>
    )
  }
}
export default mapQuest