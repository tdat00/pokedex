import * as React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';
import COLORS from '../../data/colors.json';
import DAMAGE from '../../data/damage.json';
import POKEDEX from '../../data/pokedex.json';
import TYPES from '../../data/types.json';
import { Container, Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap';


class Pokedex extends React.Component {
  TYPE_IDS = {};

  constructor(props) {
    super(props);

    this.state = {
      _selectedTypes: [],
      _damage: [],
      _pokemons: [],
      _isOpenPokemonList: false,
      _silhouette: false
    };

    Object.keys(TYPES).forEach(key => {
      let type = TYPES[key];
      type.color = COLORS[type.name.toUpperCase()];

      this.TYPE_IDS[type.name.toUpperCase()] = type.id;
    });
  }

  componentDidMount() {
    document.title = "Just another Pokedex";
  }

  sort_and_distinct(array) {
    array.sort();
    let result = [];
    array.forEach(x => {
      if (result[result.length - 1] === x) {
        return;
      }
      result.push(x);
    });
    return result;
  }

  areEquals(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }

  toggleCollapse() {
    this.setState({ _isOpenPokemonList: !this.state._isOpenPokemonList });
  }

  toggleSilhouette() {
    this.setState({ _silhouette: !this.state._silhouette });
  }

  onButtonClick(type, action) {
    let selectedTypes = this.state._selectedTypes || [];
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

    selectedTypes = this.sort_and_distinct(selectedTypes);
    let damage = this.findDamageChart(selectedTypes);
    let pokemons = this.findPokemons(selectedTypes);

    this.setState({
      _selectedTypes: selectedTypes,
      _damage: damage,
      _pokemons: pokemons
    });
  }

  findDamageChart(selectedTypes) {
    let damage = [];

    let filtered = DAMAGE.filter(x => this.areEquals(x.types, selectedTypes.map(type => type.toUpperCase())));
    if (filtered && filtered.length > 0) {
      let values = filtered[0].values;
      for (let i = 0; i < values.length; i++) {
        if (values[i].length > 0) {
          damage.push({type: TYPES[i+1].name, value: parseFloat(values[i])});
        }
      }
    }

    damage = damage.sort((a, b) => {
      if (a.value < b.value) {
        return 1;
      }
      if (a.value > b.value) {
        return -1;
      }
      return a.type.localeCompare(b.type);
    });

    return damage;
  }

  findPokemons(selectedTypes) {
    if (selectedTypes.length === 0) return [];

    let selectedType1 = selectedTypes.length > 0 ? this.TYPE_IDS[selectedTypes[0].toUpperCase()] : null;
    let selectedType2 = selectedTypes.length > 1 ? this.TYPE_IDS[selectedTypes[1].toUpperCase()] : null;

    let pokemons = [];
    Object.values(POKEDEX).forEach(pokemon => {
      if (selectedType2 !== null) { // selected 2 types
        if (
          (pokemon.type1 === selectedType1 && pokemon.type2 === selectedType2)
          || (pokemon.type1 === selectedType2 && pokemon.type2 === selectedType1)
        ) {
          pokemons.push(pokemon);
        }
      }
      else { // selected 1 type
        if (pokemon.type1 === selectedType1 || pokemon.type2 === selectedType1) {
          pokemons.push(pokemon);
        }
      }

    });
    pokemons = pokemons.sort((a, b) => a.national - b.national);
    return pokemons;
  }

  createButton(type, action) {
    if (!type) return;
    return (<Button key={action+type} color="Dark" style={{backgroundColor: COLORS[type.toUpperCase()]}} onClick={() => this.onButtonClick(type, action)}>{type}</Button>);
  }

  createBadge(type) {
    if (!type) return;
    return (<span className="badge" style={{color: "black", backgroundColor: COLORS[type.toUpperCase()]}}>{type}</span>);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col><h1>Pokedex</h1></Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                { Object.values(TYPES).map(type => type.name).sort().map(type => this.createButton(type, 'Add') )}
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
                    <Col xs="10">{ (this.state._selectedTypes || []).sort().map(type => this.createButton(type, 'Remove') )}</Col>
                    <Col xs="2"><Button key="btn-clear" color="Link" onClick={() => this.onButtonClick('_', 'Clear')}>Clear</Button></Col>
                  </Row>
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                  <CardTitle><a onClick={this.toggleCollapse.bind(this)}><h5>Possible pokemons: <strong>{ (this.state._pokemons || []).length}</strong></h5></a></CardTitle>
                  <div className={this.state._isOpenPokemonList ? "collapse show" : "collapse"}>
                    <table className="center">
                      <tbody>
                          { (this.state._pokemons || []).map(pokemon => (
                            <tr className="align-bottom border-bottom">
                              <td style={{textAlign: "left"}}><a href={`https://pokemondb.net/pokedex/${pokemon.alias}`} target="_blank">{pokemon.national}</a></td>
                              <td style={{paddingLeft: "10px", width: "30%"}}><a href={`https://pokemondb.net/pokedex/${pokemon.alias}`} target="_blank">{pokemon.fullname}</a></td>
                              <td style={{paddingLeft: "10px", textAlign: "right"}}>{this.createBadge(TYPES[pokemon.type1].name)} {this.createBadge(TYPES[pokemon.type2]?.name)}</td>
                              <td style={{width: "112px"}}><img width="112" heigh="84" src={`https://img.pokemondb.net/sprites/sword-shield/icon/${pokemon.img}.png`} onClick={this.toggleSilhouette.bind(this)} className={ this.state._silhouette ? "silhouette" : ""} /></td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                  <CardTitle><h5>Damage Chart:</h5></CardTitle>
                  { (this.state._damage || []).map(damage => (
                    <div className="row" style={{marginBottom: '0.5rem'}}>
                      <div className="col" style={{textAlign: 'right'}}><span className="btn btn-Dark" style={{backgroundColor: COLORS[damage.type.toUpperCase()]}}>{damage.type}</span></div>
                      <div className="col" style={{verticalAlign: 'center'}}><span className="btn">{damage.value}</span></div>
                    </div>
                  ))}
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                  <Col xs="9"></Col>
                  <Col xs="3" className="thankyou"><span>Powered by <a href="https://pokemondb.net/" target="_blank">PokemonDB</a></span></Col>
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
