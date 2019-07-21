import React, { Component } from 'react'
import { Button, Image, Modal } from 'semantic-ui-react'
import axios from 'axios';
import { Container } from 'semantic-ui-react';

class deleteTest extends Component {
    state = {

    }

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    setIndex = (index) => { this.setState({ currentIndexVariantImg: index }) }

    deleteTestMethod(id) {

        axios.delete('https://psychotestmodule.herokuapp.com/tests/' + id + "/")
            .then((response) => {
                let testArray = this.props.tests;
                testArray.forEach((element,index) => {
                    if(element.id===id){
                        testArray.splice(index,1);
                    }    
                });
                this.props.setTests(testArray);
                console.log("удалено")
            }).catch(e => {
                console.log(e)
            })
    }
    render() {

        const { testId,tests } = this.props;


        return (
            <Container>

                <Modal trigger={<button className='test-card__button'>Удалить</button>}
                    open={this.state.modalOpen} centered={false}>
                    <Modal.Content >
                        <Modal.Description>
                            <p>Вы уверены, что хотите удалить тест?</p>
                        </Modal.Description>

                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => { this.handleClose() }} color="primary">
                            Отмена
            </Button>
                        <Button
                            type="sumbit"
                            onClick={() => {
                                this.handleClose();
                                this.deleteTestMethod(testId);
                            }} color="primary" autoFocus>
                            Удалить
            </Button>
                    </Modal.Actions>
                </Modal>

            </Container >
        )
    }
}
export default deleteTest