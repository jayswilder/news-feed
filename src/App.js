import React from 'react';
import SearchComponent from './components/SearchComponent';
import Articles from './components/Articles';
import './App.css';

class App extends React.Component {
  state = {
    keywordInput: '',
    authorInput: '',
    dateInput: '',
    dateInSeconds: '',
    relatedArticles: []
  }


  handleChange = (event) => {
    const epochDate = new Date(event.target.value).getTime();
    const dateSearch = epochDate.toString().slice(0, 10);
    this.setState({
      [event.target.name]: event.target.value,
      dateInSeconds: dateSearch
    })
  }

  search = (event) => {
    event.preventDefault();
    const keyword = this.state.keywordInput;
    const author = this.state.authorInput;
    const date = this.state.dateInSeconds;
    let url = '';

    if (keyword && author) {
      url = `https://hn.algolia.com/api/v1/search?query=${keyword}&tags=story,author_${author}`;
    } else if (keyword) {
      url = `http://hn.algolia.com/api/v1/search?query=${keyword}&tags=story`;
    } else if (author) {
      url = `https://hn.algolia.com/api/v1/search?tags=story,author_${author}`;
    } else if (date) {
      url = `http://hn.algolia.com/api/v1/search_by_date?tags=story&numericFilters=created_at_i>${date}`
    } else {
      alert("Please enter search criteria.");
    }

    fetch(url)
      .then(response => response.json())
      .then(data => this.setState({
        relatedArticles: data.hits,
        keywordInput: '',
        authorInput: '',
      }))
      .catch(error => console.log(`Error, ${error}`))
  }


  render() {
    return (
      <div>
        <header className="App-header">
          <i className="far fa-newspaper"></i>
          <h1>News Feed Search</h1>
          <SearchComponent
            search={this.search}
            handleChange={this.handleChange}
            keywordInput={this.state.keywordInput}
            authorInput={this.state.authorInput}
            dateInput={this.state.dateInput}
          />
        </header>
        <div className="layout">
          <Articles relatedArticles={this.state.relatedArticles} />
        </div>
      </div>
    )
  }
}

export default App;