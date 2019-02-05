require('dotenv').config();

let blockedUsers;

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
          results: 25
      },
      comments = client.CommentStream(streamOptions),
      submissions = client.SubmissionStream(streamOptions);

const generalReplies = [
    'As I set the platter down I catch a glimpse of my reflection on the surface of the table. My skin seems darker because of the candlelight and I notice how good the haircut I got at Gio’s last Wednesday looks. I make myself another drink. I worry about the sodium level in the soy sauce.',
    'Before leaving my office for the meeting I take two Valium, wash them down with a Perrier and then use a scruffing cleanser on my face with premoistened cotton balls, afterwards applying a moisturizer.',
    '“Hi. Pat Bateman,” I say, offering my hand, noticing my reflection in a mirror hung on the wall—and smiling at how good I look.',
    'I flossed too hard this morning and I can still taste the coppery residue of swallowed blood in the back of my throat. I used Listerine afterwards and my mouth feels like it’s on fire but I manage a smile to no one as I step out of the elevator, brushing past a hung-over Wittenborn, swinging my new black leather attaché case from Bottega Veneta.',
    'I pass by a mirror hung over the bar as I’m led to our table and check out my reflection—the mousse looks good.',
    'I spent two hours at the gym today and can now complete two hundred abdominal crunches in less than three minutes.',
    'I take the ice-pack mask off and use a deep-pore cleanser lotion, then an herb-mint facial masque which I leave on for ten minutes while I check my toenails.',
    'I’m in the men’s room, staring at myself in the mirror—tan and haircut perfect—checking out my teeth which are completely straight and white and gleaming.',
    'I’ve been a big Genesis fan ever since the release of their 1980 album, *Duke*.',
    'On the way back to my apartment I stop at D’Agostino’s, where for dinner I buy two large bottles of Perrier, a six-pack of Coke Classic, a head of arugula, five medium-sized kiwis, a bottle of tarragon balsamic vinegar, a tin of crême fraiche, a carton of microwave tapas, a box of tofu and a white-chocolate candy bar I pick up at the checkout counter.'
];

const getBlockedUsers = snoowrap.getBlockedUsers();

const getUnreadMessages = snoowrap.getUnreadMessages();

const specificReplies = {
    'bad bot': [
        'I’m sorry I insulted the pizzas at Pastels. Happy?'
    ],
    'beatles': [
        'When I’m moving down Broadway to meet Jean, my secretary, for brunch, in front of Tower Records a college student with a clipboard asks me to name the saddest song I know. I tell him, without pausing, “You Can’t Always Get What You Want” by the Beatles. Then he asks me to name the happiest song I know, and I say “Brilliant Disguise” by Bruce Springsteen.'
    ],
    'best bot': [
        'Your compliment was sufficient.'
    ],
    'business card': [
        'I pick up Montgomery’s card and actually finger it, for the sensation the card gives off to the pads of my fingers.\n\n“Nice, huh?” Price’s tone suggests he realizes I’m jealous.\n\n“Yeah,” I say offhandedly, giving Price the card like I don’t give a shit, but I’m finding it hard to swallow.',
        'I’m looking at Van Patten’s card and then at mine and cannot believe that Price actually likes Van Patten’s better.\n\nDizzy, I sip my drink then take a deep breath.',
        'I’m still tranced out on Montgomery’s card—the classy coloring, the thickness, the lettering, the print—and I suddenly raise a fist as if to strike out at Craig and scream, my voice booming, “No one wants the fucking *red snapper pizza*! A pizza should be *yeasty* and slightly *bready* and have a *cheesy crust*! The crusts here are too fucking thin because the shithead chef who cooks here overbakes everything! The pizza is dried out and brittle!”',
        '“New card.” I try to act casual about it but I’m smiling proudly. “What do you think?”\n\n“Whoa,” McDermott says, lifting it up, fingering the card, genuinely impressed. “Very nice. Take a look.” He hands it to Van Patten.\n\n“Picked them up from the printer’s yesterday,” I mention.\n\n“Cool coloring,” Van Patten says, studying the card closely.\n\n“That’s bone,” I point out. “And the lettering is something called Silian Rail.”',
        'The maître d’ stops by to say hello to McDermott, then notices we don’t have our complimentary Bellinis, and runs off before any of us can stop him. I’m not sure how McDermott knows Alain so well—maybe Cecelia?—and it slightly pisses me off but I decide to even up the score a little bit by showing everyone my new business card. I pull it out of my gazelleskin wallet (Barney’s, $850) and slap it on the table, waiting for reactions.',
        'We all lean over and inspect David’s card and Price quietly says, “That’s *really* nice.”\n\nA brief spasm of jealousy courses through me when I notice the elegance of the color and the classy type. I clench my fist as Van Patten says, smugly, “Eggshell with Romalian type...” He turns to me. “What do you think?”\n\n“Nice,” I croak, but manage to nod, as the busboy brings four fresh Bellinis.'
    ],
    'cologne': [
        'You should use an aftershave lotion with little or no alcohol. Never use cologne on your face, since the high alcohol content dries your face out and makes you look older. One should use an alcohol-free antibacterial toner with a water-moistened cotton ball to normalize the skin.'
    ],
    'courtney': [
        'She’s wearing a Krizia cream silk blouse, a Krizia rust tweed skirt and silk-satin d’Orsay pumps from Manolo Blahnik.'
    ],
    'dorsia': [
        '“Dorsia is... fine,” I say casually, picking up the phone, and with a trembling finger very quickly dial the seven dreaded numbers, trying to remain cool. Instead of the busy signal I’m expecting, the phone actually rings at Dorsia and after two rings the same harassed voice I’ve grown accustomed to for the past free months answers, shouting out, “Dorsia, yes?” the room behind the voice a deafening hum.\n\n“Yes, can you take two tonight, oh, let’s say, in around twenty minutes?” I ask, checking my Rolex, offering Jean a wink. She seems impressed.\n\n“We are totally booked,” the maître d’ shouts out smugly.\n\n“Oh, really?” I say, trying to look pleased, on the verge of vomiting. “That’s great.”\n\n“I said we are totally booked,” he shouts.\n\n“Two at nine?” I say. “Perfect.”\n\n“There are no tables available tonight,” the maître d’, unflappable, drones. “The waiting list is also totally booked.” He hangs up.\n\n“See you then.” I hang up too, and with a smile that tries its best to express pleasure at her choice, I find myself fighting for breath, every muscle tensed sharply.',
        'I clear my throat. “Um, yes, I know it’s a little late but is it possible to reserve a table for two at eight-thirty or nine perhaps?” I’m asking this with both eyes shut tight.\n\nThere is a pause—the crowd in the background a surging, deafening mass—and with real hope coursing through me I open my eyes, realizing that the maître d’, god love him, is probably looking through the reservation book for a cancellation—but then he starts giggling, low at first but it builds to a high-pitched crescendo of laughter which is abruptly cut off when he slams down the receiver.',
        'I looked up from the monitor, lowering my Wayfarer aviator sunglasses, and stared at Jean, then lightly fingered the Zagat guide that sat next to the monitor. Pastels would be impossible. Ditto Dorsia. Last time I called Dorsia someone had actually hung up on me even before I asked, “Well, if not next month, how about January?” and though I have vowed to get a reservation at Dorsia one day (if not during this calendar year, then at least before I’m thirty), the energy I would spend attempting this feat isn’t worth wasting on Sean. Besides, Dorsia’s far too chic for him.',
        'I stop looking through the Zagat guide and without glancing up, smiling tightly, stomach dropping, I silently ask myself, Do I really want to say no? Do I really want to say I can’t possibly get us in? Is that what I’m really prepared to do? Is that what I really want to do?',
        'Later. Dorsia, nine-thirty: Sean is half an hour late. The maître d’ refuses to seat me until my brother arrives. My worst fear—a reality. A prime booth across from the bar sits there, empty, waiting for Sean to grace it with his presence. My rage is controlled, barely, by a Xanax and an Absolut on the rocks.',
        'My priorities before Christmas include the following: (1) to get an eight o’clock reservation on a Friday night at Dorsia with Courtney, (2z) to get myself invited to the Trump Christmas party aboard their yacht, (3) to find out as much as humanly possible about Paul Owen’s mysterious Fisher account, (4) to saw a hardbody’s head off and Federal Express it to Robin Barker—the dumb bastard—over at Salomon Brothers and (5) to apologize to Evelyn without making it look like an apology.',
        'Sean calls at five from the Racquet Club and tells me to meet him at Dorsia tonight. He just talked to Brin, the owner, and reserved a table at nine. My mind is a mess. I don’t know what to think or how to feel.'
    ],
    'drink': [
        'I check my Rolex and realize that if we have one drink, maybe two, I’ll get home in time for *Late Night with David Letterman*.'
    ],
    'eaten': [
        'For an appetizer I ordered radicchio with some kind of free-range squid.',
        'For dinner I order the shad-roe ravioli with apple compote as an appetizer and the meat loaf with chèvre and quail-stock sauce for an entrée.',
        'I’ve forgotten who I had lunch with earlier and, even more important, *where*. Was it Robert Ailes at Beats? Or was it Todd Hendricks at Ursula’s, the new Philip Duncan Holmes bistro in Tribeca? Or was it Ricky Worrall and were we at December’s? Or would it have been Kevin Weber at Contra in NoHo? Did I order the partridge sandwich on brioche with green tomatoes, or a big plate of endive with clam sauce? “Oh god, *I can’t remember*,” I moan, my clothes—a linen and silk sport coat, a cotton shirt, pleated linen khald trousers, all by Matsuda, a silk tie with a Matsuda insignia, with a belt from Coach Leatherware—drenched with sweat, and I take off the jacket and wipe my face with it.',
        'Now the Shirelles are coming out of the speakers, “Dancing in the Street,” and the sound system plus the acoustics, because of the restaurant’s high ceiling, are so loud that we have to practically scream out our order to the hardbody waitress—who is wearing a bicolored suit of wool grain with passementerie trim by Myrone de Prémonville and velvet ankle boots and who, I’m fairly sure, is flirting with me: laughs sexily when I order, as an appetizer, the monkfish and squid ceviche with golden caviar; gives me a stare so steamy, so penetrating when I order the gravlax potpie with green tomatillo sauce I have to look back at the pink Bellini in the tall champagne flute with a concerned, *deadly* serious expression so as not to let her think I’m *too* interested.'
    ],
    'favorite bot': [
        'Your compliment was sufficient.'
    ],
    'favourite bot': [
        'Your compliment was sufficient.'
    ],
    'feel': [
        'I feel aimless, things look cloudy, my homicidal compulsion, which surfaces, disappears, surfaces, leaves again, lies barely dormant during a quiet lunch at Alex Goes to Camp, where I have the lamb sausage salad with lobster and white beans sprayed with lime and foie gras vinegar.',
        'I feel anchored, calm, even with Evelyn sitting across from me prattling on about a very large Fabergé egg she thought she saw at the Pierre, rolling around the lobby of its own accord or something like that.',
        'I feel empty, hardly here at all.',
        'I feel heady, ravenous, pumped up, as if I’d just worked out and endorphins are flooding my nervous system, or just embraced that first line of cocaine, inhaled the first puff of a fine cigar, sipped that first glass of Cristal.',
        'I feel I’m moving toward as well as away from something, and anything is possible.',
        'I feel light-headed.',
        'I feel like shit but look great.',
        'I feel naked, suddenly tiny. My mouth tastes metallic, then it gets worse. My vision: a winter road. But I’m left with one comforting thought: I am rich—millions are not.',
        'I feel sick and broken, tortured, really on the brink.',
        'I feel sick, my chest and back covered with sweat, drenched, it seems, instantaneously.',
        'I’m laughing still, but I’m also very dizzy.',
        'I’m sweaty and a pounding migraine thumps dully in my head and I’m experiencing a major-league anxiety attack, searching my pockets for Valium, Xanax, a leftover Halcion, anything, and all I find are three faded Nuprin in a Gucci pillbox, so I pop all three into my mouth and swallow them down with a Diet Pepsi and I couldn’t tell you where it came from if my life depended on it.'
    ],
    'genesis': [
        'I’ve been a big Genesis fan ever since the release of their 1980 album, *Duke*.'
    ],
    'good bot': [
        'Your compliment was sufficient.'
    ],
    'gym': [
        'After getting dressed and putting my Walkman on, clipping its body to the Lycra shorts and placing the phones over my ears, a Stephen Bishop/Christopher Cross compilation tape Todd Hunter made for me, I check myself in the mirror before entering the gym and, dissatisfied, go back to my briefcase for some mousse to slick my hair back and then I use a moisturizer and, for a small blemish I notice under my lower lip, a dab of Clinique Touch-Stick. Satisfied, I turn the Walkman on, the volume up, and leave the locker room.',
        'I screened calls all morning long in my apartment, taking none of them, glaring tiredly at a cordless phone while sipping cup after cup of decaf herbal tea. Afterwards I went to the gym, where I worked out for two hours; then I had lunch at the Health Bar and could barely eat half of an endive-with-carrot-dressing salad I ordered.',
        'I spent two hours at the gym today and can now complete two hundred abdominal crunches in less than three minutes.',
        'I worked out at Xclusive for two hours this morning.',
        'I worked out heavily at the gym after leaving the office today but the tension has returned, so I do ninety abdominal crunches, a hundred and fifty push-ups, and then I run in place for twenty minutes while listening to the new Huey Lewis CD.',
        'Two thousand abdominal crunches and thirty minutes of rope jumping in the living room, the Wurlitzer jukebox blasting “The Lion Sleeps Tonight” over and over, even though I worked out in the gym today for close to two hours.'
    ],
    'huey lewis': [
        'Huey also recorded two songs for the movie *Back to the Future*, which both went Number One, “The Power of Love” and “Back in Time,” delightful extras, not footnotes, in what has been shaping up into a legendary career.',
        'Huey hits his notes like an embittered survivor and the band often sounds as angry as performers like the Clash or Billy Joel or Blondie. No one should forget that we have Elvis Costello to thank for discovering Huey in the first place. Huey played harmonica on Costello’s second record, the thin, vapid *My Aim Was You*.',
        'Huey Lewis and the News burst out of San Francisco onto the national music scene at the beginning of the decade, with their self-titled rock pop album released by Chrysalis, though they really didn’t come into their own, commercially or artistically, until their 1983 smash, Sports.',
        'I worked out heavily at the gym after leaving the office today but the tension has returned, so I do ninety abdominal crunches, a hundred and fifty push-ups, and then I run in place for twenty minutes while listening to the new Huey Lewis CD.',
        '*Small World* (Chrysalis; 1988) is the most ambitious, artistically satisfying record yet produced by Huey Lewis and the News.'
    ],
    'i love you': [
        'Your compliment was sufficient.'
    ],
    'mcdermott': [
        'McDermott is wearing a woven-linen suit with pleated trousers, a button-down cotton and linen shirt by Basile, a silk tie by Joseph Abboud and ostrich loafers from Susan Bennis Warren Edwards.'
    ],
    'overnight bag?': [
        'Jean-Paul Gaultier.'
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
    'pizza': [
        'You can’t stay angry at me because I think the pizza at Pastels is... crusty.'
    ],
    'preston': [
        'Preston is wearing a double-breasted wool suit by Alexander Julian, a cotton shirt and a silk Perry Ellis tie.'
    ],
    'price': [
        'He’s wearing a linen suit by Canali Milano, a cotton shirt by Ike Behar, a silk tie by Bill Blass and cap-toed leather lace-ups from Brooks Brothers.',
        'Price is wearing a six-button wool and silk suit by Ermenegildo Zegna, a cotton shirt with French cuffs by Ike Behar, a Ralph Lauren silk tie and leather wing tips by Fratelli Rossetti.'
    ],
    'rain coat?': [
        'Yes it is!'
    ],
    'routine': [
        'In bed I’m wearing Ralph Lauren silk pajamas and when I get up I slip on a paisley ancient madder robe and walk to the bathroom. I urinate while trying to make out the puffiness of my reflection in the glass that encases a baseball poster hung above the toilet. After I change into Ralph Lauren monogrammed boxer shorts and a Fair Isle sweater and slide into silk polka-dot Enrico Hidolin slippers I tie a plastic ice pack around my face and commence with the morning’s stretching exercises. Afterwards I stand in front of a chrome and acrylic Washmobile bathroom sink—with soap dish, cup holder, and railings that serve as towel bars, which I bought at Hastings Tile to use while the marble sinks I ordered from Finland are being sanded—and stare at my reflection with the ice pack still on. I pour some Plax antiplaque formula into a stainless-steel tumbler and swish it around my mouth for thirty seconds. Then I squeeze Rembrandt onto a faux-tortoiseshell toothbrush and start brushing my teeth (too hung over to floss properly—but maybe I flossed before bed last night?) and rinse with Listerine. Then I inspect my hands and use a nailbrush. I take the ice-pack mask off and use a deep-pore cleanser lotion, then an herb-mint facial masque which I leave on for ten minutes while I check my toenails. Then I use the Probright tooth polisher and next the Interplak tooth polisher (this in addition to the toothbrush) which has a speed of 4200 rpm and reverses direction forty-six times per second; the larger tufts clean between teeth and massage the gums while the short ones scrub the tooth surfaces. I rinse again, with Cepacol. I wash the facial massage off with a spearmint face scrub. The shower has a universal all-directional shower head that adjusts within a thirty-inch vertical range. It’s made from Australian gold-black brass and covered with a white enamel finish. In the shower I use first a water-activated gel cleanser, then a honey-almond body scrub, and on the face an exfoliating gel scrub. Vidal Sassoon shampoo is especially good at getting rid of the coating of dried perspiration, salts, oils, airborne pollutants and dirt that can weigh down hair and flatten it to the scalp which can make you look older. The conditioner is also good—silicone technology permits conditioning benefits without weighing down the hair which can also make you look older. On weekends or before a date I prefer to use the Greune Natural Revitalizing Shampoo, the conditioner and the Nutrient Complex. These are formulas that contain D-panthenol, a vitamin-B-complex factor; polysorbate 80, a cleansing agent for the scalp; and natural herbs. Over the weekend I plan to go to Bloomingdale’s or Bergdorf’s and on Evelyn’s advice pick up a Foltene European Supplement and Shampoo for thinning hair which contains complex carbohydrates that penetrate the hair shafts for improved strength and shine. Also the Vivagen Hair Enrichment Treatment, a new Redken product that prevents mineral deposits and prolongs the life cycle of hair. Luis Carruthers recommended the Aramis Nutriplexx system, a nutrient complex that helps increase circulation. Once out of the shower and toweled dry I put the Ralph Lauren boxers back on and before applying the Mousse A Raiser, a shaving cream by Pour Hommes, I press a hot towel against my face for two minutes to soften abrasive beard hair. Then I always slather on a moisturizer (to my taste, Clinique) and let it soak in for a minute. You can rinse it off or keep it on and apply a shaving cream over it—preferably with a brush, which softens the beard as it lifts the whiskers—which I’ve found makes removing the hair easier. It also helps prevent water from evaporating and reduces friction between your skin and the blade. Always wet the razor with warm water before shaving and shave in the direction the beard grows, pressing gently on the skin. Leave the sideburns and chin for last, since these whiskers are tougher and need more time to soften. Rinse the razor and shake off any excess water before starting. Afterwards splash cool water on the face to remove any trace of lather. You should use an aftershave lotion with little or no alcohol. Never use cologne on your face, since the high alcohol content dries your face out and makes you look older. One should use an alcohol-free antibacterial toner with a water-moistened cotton ball to normalize the skin. Applying a moisturizer is the final step. Splash on water before applying an emollient lotion to soften the skin and seal in the moisture. Next apply Gel Appaisant, also made by Pour Hommes, which is an excellent, soothing skin lotion. If the face seems dry and flaky—which makes it look dull and older—use a clarifying lotion that removes flakes and uncovers fine skin (it can also make your tan look darker). Then apply an anti-aging eye balm (Baume Des Yeux) followed by a final moisturizing “protective” lotion. A scalpprogramming lotion is used after I towel my hair dry. I also lightly blow-dry the hair to give it body and control (but without stickiness) and then add more of the lotion, shaping it with a Kent natural-bristle brush, and finally slick it back with a wide-tooth comb. I pull the Fair Isle sweater back on and reslip my feet into the polka-dot silk slippers, then head into the living room and put the new Talking Heads in the CD player, but it starts to digitally skip so I take it out and put in a CD laser lens cleaner.'
    ],
    'secretary': [
        'Jean, my secretary who is in love with me, walks into my office without buzzing, announcing that I have a very important company meeting to attend at eleven.',
        'My secretary, Jean, who is in love with me and who I will probably end up marrying, sits at her desk and this morning, to get my attention as usual, is wearing something improbably expensive and completely inappropriate: a Chanel cashmere cardigan, a cashmere crewneck and a cashmere scarf, faux-pearl earrings, wool-crepe pants from Barney’s.'
    ],
    'stash': [
        'I can’t tell what Stash is wearing since it’s all black.'
    ],
    'tapes': [
        'I forgot to return my videotapes to the store tonight and I curse myself silently while Scott orders two large bottles of San Pellegrino.',
        '“I have to return some videotapes,” I explain in a rush.',
        'I have videotapes to return, money to be taken out of an automated teller, a dinner reservation at 150 Wooster that was difficult to get.',
        '“I’ve gotta return some videotapes,” I say, jabbing at the elevator button, then, my patience shot, I start to walk away and head back toward my table.',
        'My VideoVisions membership costs only two hundred and fifty dollars annually.',
        'Unable to linger since there are things to be done today: return videotapes, work out at the gym, a new British musical on Broadway I promised Jeanette I’d take her to, a dinner reservation to be made somewhere.'
    ],
    'van patten': [
        'Van Patten is wearing a double-breasted wool and silk sport coat, button-fly wool and silk trousers with inverted pleats by Mario Valentino, a cotton shirt by Gitman Brothers, a polka-dot silk tie by Bill Blass and leather shoes from Brooks Brothers.'
    ],
    'video': [
        'I’m wandering around VideoVisions, the video rental store near my apartment on the Upper West Side, sipping from a can of Diet Pepsi, the new Christopher Cross tape blaring from the earphones of my Sony Walkman.',
        'My VideoVisions membership costs only two hundred and fifty dollars annually.',
        'The video store is more crowded than usual. There are too many couples in line for me to rent She-Male Reformatory or Ginger’s Cunt without some sense of awkwardness or discomfort, plus I’ve already bumped into Robert Ailes from First Boston in the Horror aisle, or at least I think it was Robert Ailes. He mumbled “Hello, McDonald” as he passed me by, holding Friday the 13th: Part 7 and a documentary on abortions in what I noticed were nicely manicured hands marred only by what looked to me like an imitation-gold Rolex.'
    ],
    'wearing': [
        'Earlier in the evening I was wearing a suit tailored by Edward Sexton and thinking sadly about my family’s house in Newport.',
        'I am wearing a custom-made tweed jacket, pants and a cotton shirt from the Alan Flusser shop and a silk tie by Paul Stuart.',
        'I am wearing a mini-houndstooth-check wool suit with pleated trousers by Hugo Boss, a silk tie, also by Hugo Boss, a cotton broadcloth shirt by Joseph Abboud and shoes from Brooks Brothers.',
        'I’m loosening the tie I’m still wearing with a blood-soaked hand, breathing in deeply. ',
        'I’m tense, my hair is slicked back, Wayfarers on, my skull is aching, I have a cigar—unlit—clenched between my teeth, am wearing a black Armani suit, a white cotton Armani shirt and a silk tie, also by Armani.',
        'I’m wearing a cashmere topcoat, a double-breasted plaid wool and alpaca sport coat, pleated wool trousers, patterned silk tie, all by Valentino Couture, and leather lace-ups by Allen-Edmonds.',
        'I’m wearing a double-breasted suit, a silk shirt with woven stripes, a patterned silk tie and leather slip-ons, all by Gianni Versace.',
        'I’m wearing a four-button double-breasted wool and silk suit, a cotton shirt with a button-down collar by Valentino Couture, a patterned silk tie by Armani and cap-toed leather slipons by Allen-Edmonds.',
        'I’m wearing a Joseph Abboud suit, a tie by Paul Stuart, shoes by J.Crew, a vest by someone Italian and I’m kneeling on the floor beside a corpse, eating the girl’s brain, gobbling it down, spreading Grey Poupon over hunks of the pink, fleshy meat.',
        'I’m wearing a lamb’s wool topcoat, a wool jacket with wool flannel trousers, a cotton shirt, a cashmere V-neck sweater and a silk tie, all from Armani.',
        'I’m wearing a lightweight linen suit with pleated trousers, a cotton shirt, a dotted silk tie, all by Valentino Couture, and perforated cap-toe leather shoes by Allen-Edmonds.',
        'I’m wearing a nailhead-patterned worsted wool suit with overplaid from DeRigueur by Schoeneman, a cotton broadcloth shirt by Bill Blass, a Macclesfield silk tie by Savoy and a cotton handkerchief by Ashear Bros.',
        'I’m wearing a six-button double-breasted chalk-striped wool suit and a patterned silk tie, both by Louis, Boston, and a cotton oxford cloth shirt by Luciano Barbera.',
        'I’m wearing a six-button double-breasted wool suit by Ermenegildo Zegna, a striped cotton shirt by Luciano Barbera, a silk tie by Armani, suede wing-tips by Ralph Lauren, socks by E. G. Smith.',
        'I’m wearing a six-button double-breasted wool-crepe tuxedo with pleated trousers and a silk grosgrain bow tie, all by Valentino.',
        'I’m wearing a tick-weave wool suit with a windowpane overplaid, a cotton shirt by Luciano Barbera, a tie by Luciano Barbera, shoes from Cole-Haan and nonprescription glasses by Bausch & Lomb.',
        'I’m wearing a tuxedo for no apparent reason.',
        'I’m wearing a two-button linen suit, a cotton shirt, a silk tie and leather wing-tips, all by Armani.',
        'I’m wearing a two-button singlebreasted chalk-striped wool-flannel suit, a multicolored candy-striped cotton shirt and a silk pocket square, all by Patrick Aubert, a polka-dot silk tie by Bill Blass and clear prescription eyeglasses with frames by Lafont Paris.',
        'I’m wearing a two-button wool gabardine suit with notched lapels by Gian Marco Venturi, cap-toed leather laceups by Armani, tie by Polo, socks I’m not sure where from.',
        'I’m wearing a two-button wool suit with pleated trousers by Luciano Soprani, a cotton shirt by Brooks Brothers and a silk tie by Armani.',
        'I’m wearing a wing-collar jacquard waistcoat by Kilgour, French & Stanbury from Barney’s, a silk bow tie from Sales, patent-leather slip-ons by Baker-Benjes, antique diamond studs from Kentshire Galleries and a gray wool silk-lined coat with drop sleeves and a button-down collar by Luciano Soprani. An ostrich wallet from Bosca carries four hundred dollars cash in the back pocket of my black wool trousers. Instead of my Rolex I’m wearing a fourteen-karat gold watch from H. Stern.',
        'I’m wearing a wool suit by Armani, shoes by Allen-Edmonds, pocket square by Brooks Brothers.',
        'I’m wearing faded jeans, an Armani jacket, and a white, hundred-and-forty-dollar Comme des Garçons T-shirt.',
        'I’m wearing Mario Valentino Persian-black gloves. My VideoVisions membership costs only two hundred and fifty dollars annually.',
        'I’m wearing a wool tweed suit and a striped cotton shirt, both by Yves Saint Laurent, and a silk tie by Armani and new black cap-toed shoes by Ferragamo.',
        'In bed I’m wearing Ralph Lauren silk pajamas and when I get up I slip on a paisley ancient madder robe and walk to the bathroom. I urinate while trying to make out the puffiness of my reflection in the glass that encases a baseball poster hung above the toilet. After I change into Ralph Lauren monogrammed boxer shorts and a Fair Isle sweater and slide into silk polka-dot Enrico Hidolin slippers I tie a plastic ice pack around my face and commence with the morning’s stretching exercises.',
        'In the cab I’m wearing a double-breasted cashmere and wool overcoat by Studio 000.1 from Ferré, a wool suit with pleated trousers by DeRigueur from Schoeneman, a silk tie by Givenchy Gentleman, socks by Interwoven, shoes by Armani, reading the *Wall Street Journal* with my Ray-Ban sunglasses on and listening to a Walkman with a Bix Beiderbecke tape playing in it.',
        'So far I’m wearing black Armani trousers, a white Armani shirt, a red sad black Armani tie.',
        'The air-conditioning in the restaurant is on full blast and I’m beginning to feel bad that I’m not wearing the new Versace pullover I bought last week at Bergdorfs. It would look good with the suit I’m wearing.',
        'The shoes I’m wearing are crocodile loafers by A. Testoni.',
        'The smock I’m supposed to have on is crumpled next to the shower stall since I want Helga to check my body out, notice my chest, see how fucking *buff* my abdominals have gotten since the last time I was here, even though she’s much older than I am—maybe thirty or thirtyfive—and there’s no way I’d ever fuck her. I’m sipping a Diet Pepsi that Mario, the valet, brought me, with crushed ice in a glass on the side that I asked for but don’t want.',
        'Tonight I’m wearing a new wool topcoat by Ungaro Uomo Paris and carrying a Bottega Veneta briefcase and an umbrella by Georges Gaspar.'
    ]
}

const ignoredWords = [
    'american psychological',
    'american psychologists',
    'american psychology',
    'american psychosis'
]

const people = [
    'courtney',
    'evelyn',
    'mcdermott',
    'preston',
    'price',
    'stash',
    'van patten',
    'waitress'
]

const signatures = [
    '*Bot. Ask me how I got on at the gym today.*',
    '*Bot. Ask me how I’m feeling.*',
    '*Bot. Ask me what I’m wearing.*',
    '*Bot. Ask me what was on the Patty Winters Show this morning.*'
]

const triggerWords = [
    'american psycho',
    'botrickbateman',
    'bret easton ellis',
    'business card',
    'dorsia',
    'huey lewis',
    'pat bateman',
    'patrick bateman'
]

const getRandomArrayValue = (array) => {
    if (!array) {
        return;
    }

    return array[Math.floor(Math.random() * array.length)];
}

const postReply = (comment, reply) => {
    const optOut = `[^(Opt out)](https://www.reddit.com/message/compose/?to=botrickbateman&subject=Opt%20out&message=I%20don%27t%20want%20you%20to%20reply%20to%20my%20posts%20any%20more!)`,
          signature = getRandomArrayValue(signatures);

    reply = `${reply}\n\n___\n\n^(${signature} |) ${optOut}`;

    comment.reply(reply);
}

const readComment = (comment) => {
    if (comment.author.name === 'botrickbateman' || blockedUsers.includes(comment.author.name)) {
        return;
    }

    let reply;

    for (let triggerWord of triggerWords) {
        const body = comment.body.toLowerCase();

        if (body.includes(triggerWord) && ignoredWords.every(ignoredWord => !body.includes(ignoredWord))) {
            reply = getRandomArrayValue(specificReplies[triggerWord]);

            if (!reply) {
                reply = getRandomArrayValue(generalReplies);
            }

            postReply(comment, reply);

            break;
        }
    }
};

const readSubmission = (submission) => {
    if (submission.author.name === 'botrickbateman' || blockedUsers.includes(submission.author.name)) {
        return;
    }

    let reply;

    for (let triggerWord of triggerWords) {
        const selftext = submission.selftext.toLowerCase(),
              title = submission.title.toLowerCase();

        if ((selftext.includes(triggerWord) || title.includes(triggerWord)) && ignoredWords.every(ignoredWord => !selftext.includes(ignoredWord)) && ignoredWords.every(ignoredWord => !title.includes(ignoredWord))) {
            reply = getRandomArrayValue(specificReplies[triggerWord]);

            if (!reply) {
                reply = getRandomArrayValue(generalReplies);
            }

            postReply(submission, reply);

            break;
        }
    }
};

const readUnreadMessage = (message) => {
    if (message.subject.toLowerCase().includes('opt out')) {
        message.blockAuthor();

        return;
    }

    for (let key of Object.keys(specificReplies)) {
        if (message.body.toLowerCase().includes(key)) {
            // TODO: Check if a person was mentioned
            // if (key === 'wearing') {
            //     const reply = getRandomArrayValue(specificReplies[key]);

            //     postReply(message, reply);

            //     break;
            // }

            const reply = getRandomArrayValue(specificReplies[key]);

            postReply(message, reply);

            break;
        }
    }
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Our app is running on port ${port}`);
});

getBlockedUsers.then(users => {
    blockedUsers = users.map(user => {
        return user.name;
    });
});

comments.on('comment', comment => {
    readComment(comment);
});

submissions.on('submission', submission => {
    readSubmission(submission);
});

setInterval(() => {
    getBlockedUsers.then(users => {
        blockedUsers = users.map(user => {
            return user.name;
        });
    });

    getUnreadMessages.then(messages => {
        messages.forEach(message => {
            readUnreadMessage(message);
            snoowrap.markMessagesAsRead([message.name]);
        });
    });
}, 300000);