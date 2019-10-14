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
      firstTypeHandler,
      secondTypeHandler,
      editQuest,
      groupsObject
    } = this.props

    return (

      <Card>
        <Card.Content >
          <Card.Header>Вопрос {index + 1}: {question} {groupsState && editQuest.group ? "Группа: " + editQuest.group : ""} </Card.Header>
          <p>{editQuest.timer_question ? "Таймер для вопроса: " + editQuest.timer_question : ""}</p>
          <p>{groupsState &&
            editQuest.group &&
            groupsTimerState &&
            groupsObject &&
            groupsObject[editQuest.group] ? "Таймер для данной группы: " + groupsObject[editQuest.group] : ""}</p>
          <img className="questImg" src={questImg} alt="" />
          <p>{!editQuest.not_full_price_question ? "Оценка за вопрос: " + editQuest.price_question : ""}</p>
          <p>Варианты ответа:</p>
          {
            variants ? variants.map((variant, index) => <VariantsInfo key={index} {...variant} index={index} />) : ""
          }
          <div>
            {editQuest.answers_arr ?
              <div className="variantsArray">{editQuest.answers_arr.split(",").map(item => <div className="variantsArrayItem">{item}</div>)}</div>
              : ""
            }
          </div>
          <button onClick={() => { this.deleteHandler(index, questions, setQuests); this.props.updateList() }}>удалить</button>
          {type_question === "one_answer" ?
            <OneVariantQuestion
              firstTypeHandler={firstTypeHandler}
              secondTypeHandler={secondTypeHandler}
              groupsState={groupsState}
              groupsTimerState={groupsTimerState}
              setGroups={setGroups}
              handleGroups={handleGroups}
              currentGroup={group_number}
              editQuest={editQuest}
              editIndex={index}
              updateList={updateList}
              title="Редактировать"
            />
            : ""}
          {type_question === "many_answers" ?
            <ManyVariantQuestion
              firstTypeHandler={firstTypeHandler}
              secondTypeHandler={secondTypeHandler}
              editQuest={editQuest}
              groupsState={groupsState}
              groupsTimerState={groupsTimerState}
              setGroups={setGroups}
              handleGroups={handleGroups}
              editIndex={index}
              updateList={updateList}
              title="Редактировать"
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
              title="Редактировать"
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
              title="Редактировать"
            />
            : ""}
        </Card.Content>
      </Card>
    )
  }
}
export default mapQuest