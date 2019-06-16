const form = document.getElementById('vote-form');

// Form Submit Event
form.addEventListener('submit', e => {
    const choice = document.querySelector('input[name=series]:checked').value;
    const data = {series: choice};
    
    fetch('http://localhost:5000/vote', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(res => res.json())
    .catch(err => console.log(err));

    e.preventDefault();
});

fetch('http://localhost:5000/vote')
.then(res => res.json())
.then(data => {
    const votes = data.votes;
    const totalVotes = votes.length;
    // Count vote points - acc/current
    const voteCounts = votes.reduce((acc, vote) => 
    ((acc[vote.series] = (acc[vote.series] || 0) + parseInt(vote.points)),acc), {});

    // Set initial Data Points
    if (Object.keys(voteCounts).length === 0 && voteCounts.constructor === Object) {
        voteCounts.GameOfThrones = 0;
        voteCounts.StrangerThings = 0;
        voteCounts.Hero = 0;
        voteCounts.FRIENDS = 0;
      }

    let dataPoints = [
        { label: 'GameOfThrones', y: voteCounts.GameOfThrones },
        { label: 'StrangerThings', y: voteCounts.StrangerThings },
        { label: 'Hero', y: voteCounts.Hero },
        { label: 'FRIENDS', y: voteCounts.FRIENDS }
    ];
    
    const chartContainer = document.querySelector('#chartContainer');
    
    if(chartContainer) {
        const chart = new CanvasJS.Chart('chartContainer', {
            animationEnabled: true,
            theme: 'theme1',
            title: {
                text: `Total Votes ${totalVotes}`
            },
            data: [
                {
                type: 'column',
                dataPoints: dataPoints
            }
        ]
        });
        chart.render();
    
        Pusher.logToConsole = true;
    
        var pusher = new Pusher('dbb78265f3f219a2c421', {
          cluster: 'ap2',
          forceTLS: true
        });
    
        var channel = pusher.subscribe('series-poll');
        channel.bind('series-vote', function(data) {
          dataPoints = dataPoints.map(x => {
              if(x.label == data.series) {
                  x.y += data.points;
                  return x;
              } else {
                return x;
              }
          });
          chart.render();
        });
    }
});

