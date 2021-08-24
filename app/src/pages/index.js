import * as React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';
import DATA from '../../data/data.json';
import { Container, Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap';


class Pokedex extends React.Component {
  TYPE_COLORS = {};

  constructor(props) {
    super(props);

    for (let index in DATA.TYPES) {
      let type = DATA.TYPES[index];
      this.TYPE_COLORS[type.name] = type.color;
    }
  }

  getProp(name, defaultValue) {
    return (this.state || {})[name] || defaultValue;
  }
  setProp(name, value) {
    let state = this.state || {};
    state[name] = value
    this.setState(state);
  }

  distinct(array) {
    return array.filter((value, index, self) => self.indexOf(value) === index);
  }

  areEquals(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }
    array1 = array1.sort();
    array2 = array2.sort();
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }

  onButtonClick(type, action) {
    let selectedTypes = this.getProp('_selectedTypes', []);
    switch (action) {
      case 'Add':
        if (selectedTypes.length < 2) {
          selectedTypes.push(type);
        }
        break;
      case 'Remove':
        selectedTypes = selectedTypes.filter(x => x !== type);
        break;
      case 'Clear':
        selectedTypes = [];
        break;
      default:
        console.error("Unknown action " + action);
    }

    this.findResult(selectedTypes);
    this.setProp('_selectedTypes', this.distinct(selectedTypes));
  }

  findResult(selectedTypes) {
    let result = [];

    let filtered = DATA.TYPE_CHART.filter(x => this.areEquals(x.types, selectedTypes));
    if (filtered && filtered.length > 0) {
      let values = filtered[0].values;
      for (let i = 0; i < values.length; i++) {
        if (values[i].length > 0) {
          result.push({type: DATA.TYPES[i].name, value: values[i]});
        }
      }
    }

    this.setProp("_result", result.sort((a, b) => (parseFloat(b.value) - parseFloat(a.value))*100 + a.type.localeCompare(a.type)));
  }

  createButton(type, action) {
    return (<Button key={action+type} color="Dark" style={{backgroundColor: this.TYPE_COLORS[type]}} onClick={() => this.onButtonClick(type, action)}>{type}</Button>);
  }

  render() {
    return (
      <Container className="container-fluid">
        <Row>
          <Col><h1>Pokedex</h1></Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                { DATA.TYPES.map(type => type.name).sort().map(type => this.createButton(type, 'Add') )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <CardTitle><h5>Selected Pokemon types:</h5></CardTitle>
                  <Row>
                    <Col xs="10">{ this.getProp("_selectedTypes", []).sort().map(type => this.createButton(type, 'Remove') )}</Col>
                    <Col xs="2"><Button key="btn-clear" color="Link" onClick={() => this.onButtonClick('_', 'Clear')}>Clear</Button></Col>
                  </Row>
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                  <CardTitle><h5>Weak againts:</h5></CardTitle>
                  { this.getProp("_result", []).map(result => (
                    <Row style={{marginBottom: '0.5rem'}}>
                      <Col style={{textAlign: 'right'}}><span class="btn btn-Dark" style={{backgroundColor: this.TYPE_COLORS[result.type]}}>{result.type}</span></Col>
                      <Col style={{verticalAlign: 'center'}}><span class="btn">{result.value}</span></Col>
                    </Row>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Pokedex
