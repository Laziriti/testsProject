import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

class testCard extends Component {
  handleCheck() {
    var mes = this.props.test_content;
    var obj = eval(mes);
    var mas = obj[0].variants[0];
    console.log(mas);
  }

  render() {
    const { setPage, test_name, test_author, test_img, test_content, setPassingTest, currentTest } = this.props;

    return (
      <Card>

        <Image src={test_img} />

        <Card.Content>
          <Card.Header>{test_name}</Card.Header>
          <Card.Meta>{test_author}</Card.Meta>
          {/* setPage.bind(this, 'passTest') */}
        </Card.Content>
        <Button type="button" component={Link} to="/passingTest" onClick={() => { setPassingTest(currentTest); console.log(currentTest) }} >Пройти тест</Button>

      </Card>
    )
  }
}

export default (testCard)
