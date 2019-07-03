import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Grid, GridColumn } from 'semantic-ui-react';
import '../../indexStyles.css';
import './style.css';
import axios from 'axios';
import OneVariantQuestion from '../../containers/oneVariantQuestionContainer';
import ManyVariantQuestion from '../../containers/manyVariantsQuestionContainer';
import SequenceQuestion from '../../containers/sequenceQuestionContainer'
import WriteByYourselfQuestion from '../../containers/writeByYourselfQuestionContainer';
import TestResults from '../../containers/testResultsContainer';
import AddToList from '../../containers/addToListContainer';
import { Card } from 'semantic-ui-react';

class createTestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      isOpen: false,
      actualImg: null
    };
  }

  OpenHandler = () => this.setState({ isOpen: true })

  FileSelectedHendler = event => {

    this.setState({
      selectedFile: event.target.files[0]
    })

    let files = event.target.files[0];

    const formData = new FormData();
    formData.append("img_field", files);
    console.log(formData);

    axios.post('https://psychotestmodule.herokuapp.com/api/img/', formData)
      .then((response) => {
        console.log(response);
        this.setState({ actualImg: response.data.img_field })
      }).catch(e => {
        console.log(e)
      })

  }

  handleClose(setOneVariantState) {
    setOneVariantState(true);
  }
  handleSubmit = () => {
    console.log(this.state.tt);
    var object = {};

    var formData = new FormData(document.forms.createTestForm);


    formData.append("test_content", JSON.stringify(this.props.questions));
    formData.append("test_check_sum", JSON.stringify(this.props.results));
    formData.append("test_type", this.props.testType);
    formData.set("test_img", this.state.actualImg);

    formData.forEach(function (value, key) {
      console.log(key)
      console.log(value)
      object[key] = value;
    })

    console.log(JSON.stringify(object));
    console.log(object);
    axios.post('https://psychotestmodule.herokuapp.com/tests/', formData)
      .then((response) => {
        console.log(response);
      }).catch(e => {
        console.log(e)
      })
    console.log(formData)
  }

  check = () => {
    console.log(this.props.questions)
  }

  render() {

    const { handleSubmit, pristine, reset, submitting, questions, isReady, results, testType } = this.props
    return (
      <div className='wrapper'>
        <div className='createTestBody'>
          <form name="createTestForm" className="createTestForm" >
            <div className='inputField'>
              <label>Название теста</label>
              <div className='testInput'>
                <Field
                  name="test_name"
                  component="textarea"
                  type="text"
                  placeholder="Название теста"
                />
              </div>
            </div>
            <div className='inputField'>
              <label>Имя автора</label>
              <div className='testInput'>
                <Field
                  name="test_author"
                  component="textarea"
                  type="text"
                  placeholder="Автор теста"
                />
              </div>
            </div>
            <div className='inputField'>
              <label>Логотип теста</label>
              <div className='testInput'>
                <input type="file" name="test_img" onChange={this.FileSelectedHendler}></input><br></br>
              </div>
            </div>
            <div className='inputField'>
              <label>Комментарий к тесту</label>
              <div className='testInput'>
                <Field
                  name="test_comment"
                  component="textarea"
                  type="text"
                  placeholder="Комментарий"
                />
              </div>
            </div>
            <div className='inputField'>
              <label>Количество вопросов</label>
              <div className='testInput'>
                <Field
                  name="test_question_count"
                  component="textarea"
                  type="number"
                  placeholder="Количество вопросов"
                />
              </div>
            </div>
            <div className="createFormTestMainBtn">
              <button className="formButton" type="button" onClick={this.handleSubmit} disabled={pristine || submitting}>
                Submit
        </button>
              <button className="formButton" type="button" disabled={pristine || submitting} onClick={reset}>
                Clear Values
        </button>
            </div>
          </form>

          <div className="triggerDiv">
            <div className="triggerDivItem">
              <OneVariantQuestion updateList={this.OpenHandler} />
            </div>

            {testType === 'third' ? "" :
              <div className="triggerDivItem">
                <ManyVariantQuestion updateList={this.OpenHandler} />
              </div>}
            {
              testType === 'second' || testType === 'third' ?
                ""
                : <div className="triggerDivItem"><SequenceQuestion updateList={this.OpenHandler} /></div>
            }
            {
              testType === 'second' || testType === 'third' ?
                ""
                : <div className="triggerDivItem"><WriteByYourselfQuestion updateList={this.OpenHandler} /></div>
            }

            <div className="triggerDivItem"> <TestResults currentResults={results} /></div>
          </div>
        </div>

        <div className="questionCard">
          <Card.Group itemsPerRow={1}>
            {
              !isReady ? "" :
                questions.map((quest, index) => <AddToList key={index} updateList={this.OpenHandler} index={index} className="testi" {...quest} />)
            }
          </Card.Group>
        </div>

      </div>

    )
  }
}

export default reduxForm({
  form: 'createTestForm' // a unique identifier for this form
})(createTestForm)