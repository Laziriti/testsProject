import React, { Component } from 'react'
import { Card } from 'semantic-ui-react';
import VariantsInfo from '../../containers/variantsInfoListContainer'
import './addToListStyle.css';

import OneVariantQuestion from '../../containers/oneVariantQuestionContainer';
import ManyVariantQuestion from '../../containers/manyVariantsQuestionContainer';
import SequenceQuestion from '../../containers/sequenceQuestionContainer'
import WriteByYourselfQuestion from '../../containers/writeByYourselfQuestionContainer';
class mapQuest extends Component {
  deleteHandler(index, questions, setQuests) {
    questions.splice(index, 1);
    setQuests(questions);
  }
  render() {

    const { question, variants, setQuests, questions, index,answers_arr, updateList, number_answers, type_question, questImg, price_question,not_full_price_question } = this.props

    return (

      <Card>
        <Card.Content >
          <Card.Header>Вопрос {index + 1}: {question}</Card.Header>
          <img className="questImg" src={questImg} alt="" />
          <p>Варианты ответа:</p>
          {
           variants? variants.map((variant, index) => <VariantsInfo key={index} {...variant} index={index} />):""
          }

          <button onClick={() => { this.deleteHandler(index, questions, setQuests); this.props.updateList() }}>удалить</button>
          {type_question === "one_answer" ?
            <OneVariantQuestion currentVariants={variants} currentQuestion={question} currentIndex={index} updateList={updateList} currentCount={number_answers} currentPrice={price_question} />
            : ""}
          {type_question === "many_answers" ?
            <ManyVariantQuestion currentVariants={variants} currentQuestion={question} currentPriceState={not_full_price_question} currentIndex={index} updateList={updateList} currentCount={number_answers} currentPrice={price_question} />
            : ""}
          {type_question === "sequence_answer" ?
            <SequenceQuestion currentVariants={variants} currentQuestion={question} currentPriceState={not_full_price_question} currentIndex={index} updateList={updateList} currentCount={number_answers} currentPrice={price_question} />
            : ""}
            {type_question === "write_by_yourself_answer" ?
            <WriteByYourselfQuestion currentVariants={variants} answers_arr={answers_arr} currentQuestion={question} currentPriceState={not_full_price_question} currentIndex={index} updateList={updateList} currentCount={number_answers} currentPrice={price_question} />
            : ""}
        </Card.Content>
      </Card>
    )
  }
}
export default mapQuest