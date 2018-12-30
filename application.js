require('dotenv').config();

const Snoostorm = require('snoostorm'),
      Snoowrap = require('snoowrap');

const snoowrap = new Snoowrap({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    password: process.env.REDDIT_PASS,
    userAgent: 'botrick-bateman',
    username: process.env.REDDIT_USER
});

const client = new Snoostorm(snoowrap),
      streamOptions = {
          subreddit: 'all',
          results: 25
      },
      comments = client.CommentStream(streamOptions),
      submissions = client.SubmissionStream(streamOptions);

const replies = {
    'aftershave': [
        'You should use an aftershave lotion with little or no alcohol. Never use cologne on your face, since the high alcohol content dries your face out and makes you look older. One should use an alcohol-free antibacterial toner with a water-moistened cotton ball to normalize the skin.'
    ],
    'cologne': [
        'You should use an aftershave lotion with little or no alcohol. Never use cologne on your face, since the high alcohol content dries your face out and makes you look older. One should use an alcohol-free antibacterial toner with a water-moistened cotton ball to normalize the skin.'
    ],
    'gym': [
        'I worked out heavily at the gym after leaving the office today but the tension has returned, so I do ninety abdominal crunches, a hundred and fifty push-ups, and then I run in place for twenty minutes while listening to the new Huey Lewis CD.'
    ],
    'mousse': [
        '“Hello, Halberstam,” Owen says, walking by.  “Hello, Owen,” I say, admiring the way he’s styled and slicked back his hair, with a part so even and sharp it... devastates me and I make a mental note to ask him where he purchases his hair-care products, which kind of mousse he uses, my final guess after mulling over the possibilities being Ten -X.'
    ],
    'pepsi': [
        'I’m wandering around VideoVisions, the video rental store near my apartment on the Upper West Side, sipping from a can of Diet Pepsi, the new Christopher Cross tape blaring from the earphones of my Sony Walkman.'
    ],
    'perrier': [
        'Before leaving my office for the meeting I take two Valium, wash them down with a Perrier and then use a scruffing cleanser on my face with premoistened cotton balls, afterwards applying a moisturizer.',
        'On the way back to my apartment I stop at D’Agostino’s, where for dinner I buy two large bottles of Perrier, a six-pack of Coke Classic, a head of arugula, five medium-sized kiwis, a bottle of tarragon balsamic vinegar, a tin of crême fraiche, a carton of microwave tapas, a box of tofu and a white-chocolate candy bar I pick up at the checkout counter.'
    ],
    'scallop': [
        'Van Patten has the scallop sausage and the grilled salmon with raspberry vinegar and guacamole. The air-conditioning in the restaurant is on full blast and I\’m beginning to feel bad that I\’m not wearing the new Versace pullover I bought last week at Bergdorfs. It would look good with the suit I’m wearing.'
    ],
    'valium': [
        'Before leaving my office for the meeting I take two Valium, wash them down with a Perrier and then use a scruffing cleanser on my face with premoistened cotton balls, afterwards applying a moisturizer.'
    ],
    'video store': [
        'The video store is more crowded than usual. There are too many couples in line for me to rent She-Male Reformatory or Ginger’s Cunt without some sense of awkwardness or discomfort, plus I’ve already bumped into Robert Ailes from First Boston in the Horror aisle, or at least I think it was Robert Ailes. He mumbled “Hello, McDonald” as he passed me by, holding Friday the 13th: Part 7 and a documentary on abortions in what I noticed were nicely manicured hands marred only by what looked to me like an imitation-gold Rolex.'
    ]
}

const getReply = (keyword) => {
    return replies[keyword][Math.floor(Math.random() * replies[keyword].length)];
}

const readComment = (comment) => {
    for (let key of Object.keys(replies)) {
        if (comment.body.includes(key)) {
          const reply = getReply(key);

          console.log('reply', reply);
          break;
        }
    }
};

comments.on('comment', comment => {
    readComment(comment);
});

submissions.on('submission', submission => {
    // console.log('New submission: ', submission.title);
});