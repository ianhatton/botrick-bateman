require('dotenv').config();

const express = require('express'),
      app = express(),
      path = require('path'),
      port = process.env.PORT || 8080,
      Snoostorm = require('snoostorm'),
      Snoowrap = require('snoowrap');

// Local
const snoowrap = new Snoowrap({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    password: process.env.REDDIT_PASS,
    userAgent: 'botrick-bateman',
    username: process.env.REDDIT_USER
});

// const snoowrap = new Snoowrap({
//     clientId: os.environ['CLIENT_ID'],
//     clientSecret: os.environ['CLIENT_SECRET'],
//     password: os.environ['REDDIT_PASS'],
//     userAgent: 'botrick-bateman',
//     username: os.environ['REDDIT_USER']
// });

const client = new Snoostorm(snoowrap),
      streamOptions = {
          subreddit: 'all',
          results: 10
      },
      comments = client.CommentStream(streamOptions),
      submissions = client.SubmissionStream(streamOptions);

const replies = {
    'aftershave': [
        'You should use an aftershave lotion with little or no alcohol. Never use cologne on your face, since the high alcohol content dries your face out and makes you look older. One should use an alcohol-free antibacterial toner with a water-moistened cotton ball to normalize the skin.'
    ],
    'armani': [
        'I pull my Armani shirt up and place her hand on my torso, wanting her to feel how rock-hard, how *halved* my stomach is, and I flex the muscles, grateful it’s light in the room so she can see how bronzed and defined my abdomen has become.'
    ],
    'butner': [
        'Butner is wearing a pair of knee-length nylon and Lycra shorts with checkerboard inserts and a cotton and Lycra tank top and leather Reeboks.'
    ],
    'cheesecake': [
        '“Cheesecake?” I say, confused by this plain, alien-sounding list. “What sauce or fruits were on the roasted chicken? What shapes was it cut into?”'
    ],
    'cologne': [
        'You should use an aftershave lotion with little or no alcohol. Never use cologne on your face, since the high alcohol content dries your face out and makes you look older. One should use an alcohol-free antibacterial toner with a water-moistened cotton ball to normalize the skin.'
    ],
    'dorsia': [
        'I stop looking through the Zagat guide and without glancing up, smiling tightly, stomach dropping, I silently ask myself, Do I really want to say no? Do I really want to say I can’t possibly get us in? Is that what I’m really prepared to do? Is that what I really want to do?'
    ],
    'gym': [
        'After getting dressed and putting my Walkman on, clipping its body to the Lycra shorts and placing the phones over my ears, a Stephen Bishop/Christopher Cross compilation tape Todd Hunter made for me, I check myself in the mirror before entering the gym and, dissatisfied, go back to my briefcase for some mousse to slick my hair back and then I use a moisturizer and, for a small blemish I notice under my lower lip, a dab of Clinique Touch-Stick. Satisfied, I turn the Walkman on, the volume up, and leave the locker room.',
        'I screened calls all morning long in my apartment, taking none of them, glaring tiredly at a cordless phone while sipping cup after cup of decaf herbal tea. Afterwards I went to the gym, where I worked out for two hours; then I had lunch at the Health Bar and could barely eat half of an endive-with-carrot-dressing salad I ordered.',
        'I spent two hours at the gym today and can now complete two hundred abdominal crunches in less than three minutes.',
        'I worked out heavily at the gym after leaving the office today but the tension has returned, so I do ninety abdominal crunches, a hundred and fifty push-ups, and then I run in place for twenty minutes while listening to the new Huey Lewis CD.',
        'No hardbodies at the gym today. Only faggots from the West Side, probably unemployed actors, waiters by night, and Muldwyn Butner of Sachs, who I went to Exeter with, over at the biceps curl machine.',
        'Two thousand abdominal crunches and thirty minutes of rope jumping in the living room, the Wurlitzer jukebox blasting “The Lion Sleeps Tonight” over and over, even though I worked out in the gym today for close to two hours.'
    ],
    'huey lewis': [
        'Huey Lewis and the News burst out of San Francisco onto the national music scene at the beginning of the decade, with their self-titled rock pop album released by Chrysalis, though they really didn’t come into their own, commercially or artistically, until their 1983 smash, Sports.'
    ],
    'lipstick': [
        '*The Patty Winters Show* this morning was about Perfumes and Lipsticks and Makeups.'
    ],
    'makeup': [
        '*The Patty Winters Show* this morning was about Perfumes and Lipsticks and Makeups.'
    ],
    'mousse': [
        '“Hello, Halberstam,” Owen says, walking by.  “Hello, Owen,” I say, admiring the way he’s styled and slicked back his hair, with a part so even and sharp it... devastates me and I make a mental note to ask him where he purchases his hair-care products, which kind of mousse he uses, my final guess after mulling over the possibilities being Ten -X.'
    ],
    'pepsi': [
        'I’m wandering around VideoVisions, the video rental store near my apartment on the Upper West Side, sipping from a can of Diet Pepsi, the new Christopher Cross tape blaring from the earphones of my Sony Walkman.',
        '“Listen. I’ll be daring,” Anne says finally. “I’ll have a Diet Coke with rum.”  Scott sighs, then smiles, beaming really. “Good.”  “That’s a caffeine-fine Diet Coke, right?” Anne asks the waiter.  “You know,” I interrupt, “you should have it with Diet Pepsi. It’s much better.”  “Really?” Anne asks. “What do you mean?”  “You should have the Diet Pepsi instead of the Diet Coke,” I say. “It’s much better. It’s fizzier. It has a cleaner taste. It mixes better with rum and has a lower sodium content.”'
    ],
    'perfume': [
        '*The Patty Winters Show* this morning was about Perfumes and Lipsticks and Makeups.'
    ],
    'perrier': [
        'Before leaving my office for the meeting I take two Valium, wash them down with a Perrier and then use a scruffing cleanser on my face with premoistened cotton balls, afterwards applying a moisturizer.',
        'On the way back to my apartment I stop at D’Agostino’s, where for dinner I buy two large bottles of Perrier, a six-pack of Coke Classic, a head of arugula, five medium-sized kiwis, a bottle of tarragon balsamic vinegar, a tin of crême fraiche, a carton of microwave tapas, a box of tofu and a white-chocolate candy bar I pick up at the checkout counter.'
    ],
    'rambo': [
        '*The Patty Winters Show* this morning was about Real-Life Rambos.'
    ],
    'scallop': [
        'Van Patten has the scallop sausage and the grilled salmon with raspberry vinegar and guacamole. The air-conditioning in the restaurant is on full blast and I\’m beginning to feel bad that I\’m not wearing the new Versace pullover I bought last week at Bergdorfs. It would look good with the suit I’m wearing.'
    ],
    'ufo': [
        '*The Patty Winters Show* this morning was about UFOs That Kill.'
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

          if (reply) {
              replyToComment(comment, reply);
          }

          break;
        }
    }
};

const replyToComment = (comment, reply) => {
    comment.reply(reply);
}

comments.on('comment', comment => {
    if (comment.author.name !== 'botrickbateman') {
        readComment(comment);
    }
});

// submissions.on('submission', submission => {
//     console.log('New submission: ', submission.title);
// });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Our app is running on port ${port}`);
});