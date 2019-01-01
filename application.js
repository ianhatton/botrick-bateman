require('dotenv').config();

const express = require('express'),
      app = express(),
      path = require('path'),
      port = process.env.PORT || 8080,
      Snoostorm = require('snoostorm'),
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
          results: 10
      },
      comments = client.CommentStream(streamOptions),
      submissions = client.SubmissionStream(streamOptions);

const commentReplies = [
    'Before leaving my office for the meeting I take two Valium, wash them down with a Perrier and then use a scruffing cleanser on my face with premoistened cotton balls, afterwards applying a moisturizer.',
    '“Hi. Pat Bateman,” I say, offering my hand, noticing my reflection in a mirror hung on the wall—and smiling at how good I look.',
    'I spent two hours at the gym today and can now complete two hundred abdominal crunches in less than three minutes.',
    'I’m wandering around VideoVisions, the video rental store near my apartment on the Upper West Side, sipping from a can of Diet Pepsi, the new Christopher Cross tape blaring from the earphones of my Sony Walkman.',
    'I’ve been a big Genesis fan ever since the release of their 1980 album, *Duke*.'
];

const generalReplies = [
    'Before leaving my office for the meeting I take two Valium, wash them down with a Perrier and then use a scruffing cleanser on my face with premoistened cotton balls, afterwards applying a moisturizer.',
    'On the way back to my apartment I stop at D’Agostino’s, where for dinner I buy two large bottles of Perrier, a six-pack of Coke Classic, a head of arugula, five medium-sized kiwis, a bottle of tarragon balsamic vinegar, a tin of crême fraiche, a carton of microwave tapas, a box of tofu and a white-chocolate candy bar I pick up at the checkout counter.'
];

const inboxReplies = {
    'beatles': [
        'When I’m moving down Broadway to meet Jean, my secretary, for brunch, in front of Tower Records a college student with a clipboard asks me to name the saddest song I know. I tell him, without pausing, “You Can’t Always Get What You Want” by the Beatles. Then he asks me to name the happiest song I know, and I say “Brilliant Disguise” by Bruce Springsteen.'
    ],
    'business card': [
        'I’m looking at Van Patten’s card and then at mine and cannot believe that Price actually likes Van Patten’s better.\nDizzy, I sip my drink then take a deep breath.',
        '“New card.” I try to act casual about it but I’m smiling proudly. “What do you think?”\n“Whoa,” McDermott says, lifting it up, fingering the card, genuinely impressed. “Very nice. Take a look.” He hands it to Van Patten.\n“Picked them up from the printer’s yesterday,” I mention.\n“Cool coloring,” Van Patten says, studying the card closely.\n“That’s bone,” I point out. “And the lettering is something called Silian Rail.”'
    ],
    'cologne': [
        'You should use an aftershave lotion with little or no alcohol. Never use cologne on your face, since the high alcohol content dries your face out and makes you look older. One should use an alcohol-free antibacterial toner with a water-moistened cotton ball to normalize the skin.'
    ],
    'dorsia': [
        '“Dorsia is... fine,” I say casually, picking up the phone, and with a trembling finger very quickly dial the seven dreaded numbers, trying to remain cool. Instead of the busy signal I’m expecting, the phone actually rings at Dorsia and after two rings the same harassed voice I’ve grown accustomed to for the past free months answers, shouting out, “Dorsia, yes?” the room behind the voice a deafening hum.\n“Yes, can you take two tonight, oh, let’s say, in around twenty minutes?” I ask, checking my Rolex, offering Jean a wink. She seems impressed.\n“We are totally booked,” the maître d’ shouts out smugly.\n“Oh, really?” I say, trying to look pleased, on the verge of vomiting. “That’s great.”\n“I said we are totally booked,” he shouts.\n“Two at nine?” I say. “Perfect.”\n“There are no tables available tonight,” the maître d’, unflappable, drones. “The waiting list is also totally booked.” He hangs up.\n“See you then.” I hang up too, and with a smile that tries its best to express pleasure at her choice, I find myself fighting for breath, every muscle tensed sharply.',
        'I clear my throat. “Um, yes, I know it’s a little late but is it possible to reserve a table for two at eight-thirty or nine perhaps?” I’m asking this with both eyes shut tight.\nThere is a pause—the crowd in the background a surging, deafening mass—and with real hope coursing through me I open my eyes, realizing that the maître d’, god love him, is probably looking through the reservation book for a cancellation—but then he starts giggling, low at first but it builds to a high-pitched crescendo of laughter which is abruptly cut off when he slams down the receiver.',
        'I looked up from the monitor, lowering my Wayfarer aviator sunglasses, and stared at Jean, then lightly fingered the Zagat guide that sat next to the monitor. Pastels would be impossible. Ditto Dorsia. Last time I called Dorsia someone had actually hung up on me even before I asked, “Well, if not next month, how about January?” and though I have vowed to get a reservation at Dorsia one day (if not during this calendar year, then at least before I’m thirty), the energy I would spend attempting this feat isn’t worth wasting on Sean. Besides, Dorsia’s far too chic for him.',
        'I stop looking through the Zagat guide and without glancing up, smiling tightly, stomach dropping, I silently ask myself, Do I really want to say no? Do I really want to say I can’t possibly get us in? Is that what I’m really prepared to do? Is that what I really want to do?',
        'Later. Dorsia, nine-thirty: Sean is half an hour late. The maître d’ refuses to seat me until my brother arrives. My worst fear—a reality. A prime booth across from the bar sits there, empty, waiting for Sean to grace it with his presence. My rage is controlled, barely, by a Xanax and an Absolut on the rocks.',
        'My priorities before Christmas include the following: (1) to get an eight o’clock reservation on a Friday night at Dorsia with Courtney, (2z) to get myself invited to the Trump Christmas party aboard their yacht, (3) to find out as much as humanly possible about Paul Owen’s mysterious Fisher account, (4) to saw a hardbody’s head off and Federal Express it to Robin Barker—the dumb bastard—over at Salomon Brothers and (5) to apologize to Evelyn without making it look like an apology.',
        'Sean calls at five from the Racquet Club and tells me to meet him at Dorsia tonight. He just talked to Brin, the owner, and reserved a table at nine. My mind is a mess. I don’t know what to think or how to feel.'
    ],
    'drink': [
        'I check my Rolex and realize that if we have one drink, maybe two, I’ll get home in time for *Late Night with David Letterman*.'
    ],
    'food': [
        'I fork a piece of monkfish, push it into some of the golden caviar, then place the fork back down.',
        'Van Patten has the scallop sausage and the grilled salmon with raspberry vinegar and guacamole. The air-conditioning in the restaurant is on full blast and I\’m beginning to feel bad that I\’m not wearing the new Versace pullover I bought last week at Bergdorfs. It would look good with the suit I’m wearing.'
    ],
    'genesis': [
        'I’ve been a big Genesis fan ever since the release of their 1980 album, *Duke*.'
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
    'mousse': [
        '“Hello, Halberstam,” Owen says, walking by.\n“Hello, Owen,” I say, admiring the way he’s styled and slicked back his hair, with a part so even and sharp it... devastates me and I make a mental note to ask him where he purchases his hair-care products, which kind of mousse he uses, my final guess after mulling over the possibilities being Ten -X.'
    ],
    'patty': [
        'On *The Patty Winters Show* this morning the topic was Beautiful Teenage Lesbians, which I found so erotic I had to stay home, miss a meeting, jerk off twice.',
        'Talking animals were the topic of this morning’s *Patty Winters Show*. An octopus was floating in a makeshift aquarium with a microphone attached to one of its tentacles and it kept asking—or so its “trainer,” who is positive that mollusks have vocal cords, assured us—for “cheese.” I watched, vaguely transfixed, until I started to sob.',
        '*The Patty Winters Show* this morning was about a boy who fell in love with a box of soap.',
        '*The Patty Winters Show* this morning was about a new sport called Dwarf Tossing.',
        '*The Patty Winters Show* this morning was about Aerobic Exercise.',
        '*The Patty Winters Show* this morning was about Nazis and, inexplicably, I got a real charge out of watching it. Though I wasn’t exactly charmed by their deeds, I didn’t find them unsympathetic either, nor I might add did most of the members of the audience. One of the Nazis, in a rare display of humor, even juggled grapefruits and, delighted, I sat up in bed and clapped.',
        '*The Patty Winters Show* this morning was about Perfumes and Lipsticks and Makeups.',
        '*The Patty Winters Show* this morning was about Real-Life Rambos.',
        '*The Patty Winters Show* this morning was about Salad Bars.',
        '*The Patty Winters Show* this morning was about Shark Attack Victims.',
        '*The Patty Winters Show* this morning was about the possibility of nuclear war, and according to the panel of experts the odds are pretty good it will happen sometime within the next month.',
        '*The Patty Winters Show* this morning was about UFOs That Kill.',
        '*The Patty Winters Show* today was—ironically, I thought—about Princess Di’s beauty tips.',
        '*The Patty Winters Show* this morning was Aspirin: Can It Save Your Life?',
        '*The Patty Winters Show* this morning was Has Patrick Swayze Become Cynical or Not?'
    ],
    'pepsi': [
        'I’m wandering around VideoVisions, the video rental store near my apartment on the Upper West Side, sipping from a can of Diet Pepsi, the new Christopher Cross tape blaring from the earphones of my Sony Walkman.',
        '“Listen. I’ll be daring,” Anne says finally. “I’ll have a Diet Coke with rum.”\nScott sighs, then smiles, beaming really. “Good.”\n“That’s a caffeine-fine Diet Coke, right?” Anne asks the waiter.\n“You know,” I interrupt, “you should have it with Diet Pepsi. It’s much better.”\n“Really?” Anne asks. “What do you mean?”\n“You should have the Diet Pepsi instead of the Diet Coke,” I say. “It’s much better. It’s fizzier. It has a cleaner taste. It mixes better with rum and has a lower sodium content.”'
    ],
    'secretary': [
        'Jean, my secretary who is in love with me, walks into my office without buzzing, announcing that I have a very important company meeting to attend at eleven.',
        'My secretary, Jean, who is in love with me and who I will probably end up marrying, sits at her desk and this morning, to get my attention as usual, is wearing something improbably expensive and completely inappropriate: a Chanel cashmere cardigan, a cashmere crewneck and a cashmere scarf, faux-pearl earrings, wool-crepe pants from Barney’s.'
    ],
    'video store': [
        'The video store is more crowded than usual. There are too many couples in line for me to rent She-Male Reformatory or Ginger’s Cunt without some sense of awkwardness or discomfort, plus I’ve already bumped into Robert Ailes from First Boston in the Horror aisle, or at least I think it was Robert Ailes. He mumbled “Hello, McDonald” as he passed me by, holding Friday the 13th: Part 7 and a documentary on abortions in what I noticed were nicely manicured hands marred only by what looked to me like an imitation-gold Rolex.'
    ]
}

const getReply = (replies) => {
    return replies[Math.floor(Math.random() * replies.length)];
}

const triggerWords = [
    'american psycho',
    'bateman',
    'botrickbateman',
    'bret easton ellis',
    'business card',
    'dorsia'
]

const readComment = (comment) => {
    if (comment.author.name === 'botrickbateman') {
        return;
    }

    for (let triggerWord of triggerWords) {
        if (comment.body.includes(triggerWord)) {
            const reply = getReply(commentReplies);

            if (reply) {
                replyToComment(comment, reply);
            }

            break;
        }
    }
};

const readInboxComment = (comment) => {
    let reply;

    for (let key of Object.keys(inboxReplies)) {
        if (comment.body.includes(key)) {
            reply = getReply(inboxReplies[key]);
   
            if (reply) {
                replyToComment(comment, reply);
            }
   
            break;
        }
    }

    // if (!reply) {
    //     reply = getReply(generalReplies);

    //     replyToComment(comment, reply);
    // }
};

const replyToComment = (comment, reply) => {
    reply = `${reply}\n___\n^(I'm a bot)`;

    comment.reply(reply);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Our app is running on port ${port}`);
});

comments.on('comment', comment => {
    readComment(comment);
});

// submissions.on('submission', submission => {
//     console.log('New submission: ', submission.title);
// });

setInterval(() => {
    const getUnreadMessages = snoowrap.getUnreadMessages();

    getUnreadMessages.then((messages) => {
        messages.forEach(message => {
            readInboxComment(message);
            snoowrap.markMessagesAsRead([message.name]);
        });
    });
}, 300000);