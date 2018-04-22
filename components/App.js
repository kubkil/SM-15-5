App = React.createClass({
  getInitialState() {
    return {
      loading: false,
      searchingText: '',
      gif: {}
    };
  },

  getGif: function (searchingText) {
    return new Promise(
      function (resolve, reject) {
        const API = 'https://api.giphy.com';
        const KEY = 'Ahz6kKvHoNTrwWXaZYfD2P3uhpLF60NE';
        const url = API + '/v1/gifs/random?api_key=' + KEY + '&tag=' + searchingText;
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText).data
            const gif = {
              url: data.fixed_width_downsampled_url,
              sourceUrl: data.url
            }
            resolve(gif);
          } else {
            reject(Error(xhr.statusText));
          }
        };
        xhr.onerror = function () {
          reject(Error(`XMLHttpRequest Error: ${this.statusText}`));
        }
        xhr.open('GET', url);
        xhr.send();
      }
    );
  },

  handleSearch: function (searchingText) {
    this.setState({
      loading: true
    });
    this.getGif(searchingText)
      .then(function (gif) {
        this.setState({
          loading: false,
          gif: gif,
          searchingText: searchingText
        });
      // bind(this) bo brak arrow function?
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      }.bind(this));
  },

  render: function () {
    const styles = {
      margin: '0 auto',
      textAlign: 'center',
      width: '90%'
    };

    return (
      <div style={styles}>
        <h1>Wyszukiwarka GIFow!</h1>
        <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
        <Search onSearch={this.handleSearch} />
        <Gif
          loading={this.state.loading}
          url={this.state.gif.url}
          sourceUrl={this.state.gif.sourceUrl}
        />
      </div>
    );
  },

});
