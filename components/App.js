// wszystko ma być w tej klasie - od góry do dołu?
App = React.createClass({
  getInitialState() {
    return {
      loading: false,
      searchingText: '',
      gif: {}
    };
  },

  getGit: function (searchingText) {
    return new Promise(function (resolve, reject) {
      const url = 'https://api.giphy.com' + '/v1/gifs/random?api_key=' + 'Ahz6kKvHoNTrwWXaZYfD2P3uhpLF60NE' + '&tag=' + searchingText;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
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
      }
    });
    xhr.send();
  },

  handleSearch: function (searchingText) {
    this.setState({
      loading: true
    });
    // dlaczego gif => zamiast function(gif) wywala błąd składni w linii 43 kropka przed bind?
    this.getGif(searchingText).then(function (gif) {
      this.setState({
        loading: false,
        gif: gif,
        searchingText: searchingText
      });
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    })
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
