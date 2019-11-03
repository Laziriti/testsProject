import React, { Component } from 'react'
import { Card } from 'semantic-ui-react';
import VariantsInfo from '../variantsInfoListComponent/variantsInfoListContainer'
import './addToListStyle.css';

import OneVariantQuestion from '../oneVariantQuestionComponent/oneVariantQuestionContainer';
import ManyVariantQuestion from '../manyVariantsQuestionComponent/manyVariantsQuestionContainer';
import SequenceQuestion from '../sequenceQuestionComponent/sequenceQuestionContainer'
import WriteByYourselfQuestion from '../writeByYourselfQuestionCompoent/writeByYourselfQuestionContainer';

class mapQuest extends Component {
  state = {
    openSw: false
  }
  componentDidMount() {
    this.setState({ openSw: false })
  }
  deleteHandler(index, questions, setQuests) {
    questions.splice(index, 1);
    setQuests(questions);
  }

  openCloseSwitch() {
    this.setState({ openSw: !this.state.openSw })
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

      <Card className="list-block">
        <Card.Content className="list-block__container">
          <Card.Header className="list-block__title" onClick={() => { this.openCloseSwitch() }}>
            <div className="list-block__title-top">{groupsState && editQuest.group ? "Группа: " + editQuest.group : ""} </div>
            <div className="list-block__title-bot">
              <div className="list-block__title-left">Вопрос {index + 1}:   </div>
              <div className="list-block__title-right"> {question}</div>
            </div>
          </Card.Header>
          {this.state.openSw ? <div className="list-block__info">
            <p className="list-block__p">{editQuest.timer_question ? "Таймер для вопроса: " + editQuest.timer_question : ""}</p>
            <p className="list-block__p">{groupsState &&
              editQuest.group &&
              groupsTimerState &&
              groupsObject &&
              groupsObject[editQuest.group] ? "Таймер для данной группы: " + groupsObject[editQuest.group] : ""}</p>
            <img className="list-block__quest-img" src={questImg} alt="" />
            <p className="list-block__p">{!editQuest.not_full_price_question ? "Оценка за вопрос: " + editQuest.price_question : ""}</p>
            <p className="list-block__p">Варианты ответа:</p>
            {
              variants ? variants.map((variant, index) => <VariantsInfo key={index} {...variant} index={index} />) : ""
            }
            <div className="list-block__answers">
              {editQuest.answers_arr ?
                <div className="list-block__variants-array">{editQuest.answers_arr.split(",").map(item => <div className="list-block__variants-array-item">{item}</div>)}</div>
                : ""
              }
            </div>
            <div className="list-block__buttons">
              <div>
                <button className="list-block__delete-btn" onClick={() => { this.deleteHandler(index, questions, setQuests); this.props.updateList() }}>Удалить</button>
              </div>
              <div>
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
              </div>
            </div>
          </div> : null}
        </Card.Content>
      </Card>
    )
  }
}
export default mapQuest