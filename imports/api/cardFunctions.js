export const generateDeck = () => {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['C', 'D', 'H', 'S'];
    return suits.map(suit => ranks.map(rank => `${rank}${suit}`)).flat();
};
export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export const getRandomCard = () => generateDeck()[getRandomInt(0, 52)];

export const getValue = card => {
    const rank = card.slice(0, -1)
    if (Number(rank)) return Number(rank);
    if (rank === 'A') return 1;
    // For J, Q, K
    return 10
};

export const getRank = card => card.slice(0, -1);
export const getSuit = card => card.slice(-1);
export const getOrder = card => {
    const rank = card.slice(0, -1)
    if (Number(rank)) return Number(rank);
    if (rank === 'A') return 1;
    if (rank === 'J') return 11;
    if (rank === 'Q') return 12;
    if (rank === 'K') return 13;
};

export const getUniqueRandomCard = pickedCard => {
    const deck = generateDeck();
    const chooseFrom = pickedCard ?
        deck.filter(card => getRank(card) !== getRank(pickedCard)) :
        deck
    return chooseFrom[getRandomInt(0, chooseFrom.length)]
}

export const getTotal = cards => (
    cards.map(card => getValue(card)).reduce((acc, cVal) => acc + cVal)
)

export const findDuplicates = arr => {
    // puts array in ascending order
    let sorted = arr.slice().sort((a, b) => a - b);
    for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] == sorted[i]) return true;
    }
    return false;
}

export const deal = (playerNumber, amount) => {
    const deck = generateDeck();
    const players = [];
    for (let i = 0; i < playerNumber; i++) {
        players.push({ hand: [] })
    }

    function recur(deck, players, amount, dealTo) {
        if (players[0].hand.length === amount && players[1].hand.length === amount) {
            const starterCard = deck[getRandomInt(0, deck.length)]
            return { starterCard, players }
        } else {
            const selectedCard = deck[getRandomInt(0, deck.length)];
            const newDeck = deck.filter(card => card !== selectedCard);
            players[dealTo].hand.push(selectedCard)
            const dealToNext = dealTo === 0 ? 1 : 0;
            return recur(newDeck, players, amount, dealToNext);
        }
    }
    return recur(deck, players, amount, 0)
}


export const getRunPoints = run => {
    const scoringEvents = []
    const checkForMatches = (run, counter) => {
        if (run.length < 2) return counter

        const orders = run.map(card => getOrder(card))
        if (orders[orders.length - 1] !== orders[orders.length - 2]) {
            return counter
        }
        return checkForMatches(run.slice(0, run.length - 1), ++counter)
    }
    const matches = checkForMatches(run, 0);
    if (matches === 1) {
        scoringEvents.push({ type: 'Pair', points: 2 })
    }
    if (matches === 2) {
        scoringEvents.push({ type: 'Three of a Kind', points: 6 })
    }
    if (matches === 3) {
        scoringEvents.push({ type: 'Four of a Kind', points: 12 })
    }

    const checkForStraights = run => {
        // base case for recursion
        if (run.length < 3) return false
        const orderNumbers = run.map(card => getOrder(card))
        const max = Math.max(...orderNumbers);
        const min = Math.min(...orderNumbers);

        // check if numbers are consecutive
        if (max - min + 1 === orderNumbers.length) {
            //check for duplicates
            const duplicate = findDuplicates(orderNumbers);
            if (!duplicate) return run
        }
        return checkForStraights(run.slice(1))
    }

    const straight = checkForStraights(run);
    
    if (straight) {
        scoringEvents.push({
            type: 'Run',
            points: straight.length
        })
    }

    const runTotal = getTotal(run)
    if (runTotal == 15) {
        scoringEvents.push({ type: '15', points: 2 })
    }
    if (runTotal == 31) {
        scoringEvents.push({ type: '31', points: 1 })
    }

    if(scoringEvents.length > 0) {
        scoringEvents.forEach(ev => ev.cardIndex = run.length - 1)
    }

    return { scoringEvents, runTotal }
}


export const getHandPoints = hand => {
    function combine(a, min) {
        var fn = function(n, src, got, all) {
            if (n == 0) {
                if (got.length > 0) {
                    all[all.length] = got;
                }
                return;
            }
            for (var j = 0; j < src.length; j++) {
                fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
            }
            return;
        }
        var all = [];
        for (var i = min; i < a.length; i++) {
            fn(i, a, [], all);
        }
        all.push(a);
        return all;
    }

    function checkForStraight(run) {
        if (run.length < 3) return false

        const orderNumbers = run.map(card => getOrder(card))
        const max = Math.max(...orderNumbers);
        const min = Math.min(...orderNumbers);
        // check if numbers are consecutive
        if (max - min + 1 === orderNumbers.length) {
            //check for duplicates
            const duplicate = findDuplicates(orderNumbers);
            if (!duplicate) return run
        }
        return false
    }


    function getStraights(combos) {
        const straights = []
        const checker = (arr, target) => target.every(v => arr.includes(v));

        combos.forEach(c => {
            const newStraight = checkForStraight(c);
            if (newStraight) straights.push(newStraight)
        });

        const uniqueStraights = []
        straights.forEach(s => {
            const others = straights.filter(el => el !== s)
            if (!others.some(el => checker(el, s))) {
                uniqueStraights.push(s)
            }
        });
        // return uniqueStraights
        return uniqueStraights.map(s => ({
            type: 'Run',
            points: s.length,
            cards: s
        }))
    }

    function getPairs(combos) {
        const pairs = []
        combos.forEach(c => {
            if (c.length === 2) {
                if (getRank(c[0]) === getRank(c[1])) pairs.push(c)
            }
        });

        return pairs.map(p => ({
            type: 'Pair',
            points: 2,
            cards: p
        }))
    }

    function getFlush(combos) {
        let flush = []
        combos.forEach(c => {
            if (c.length > 3) {
                const suits = c.map(el => getSuit(el));
                if (suits.every(s => s === suits[0])) {
                    flush = suits
                }
            }
        });
        return flush.map(f => ({
            type: 'Pair',
            points: f.length,
            cards: f
        }))
    }

    function getFifteens(combos) {
        let fifteens = []
        combos.forEach(c => {
            if (getTotal(c) === 15) fifteens.push(c)
        });
        return fifteens.map(f => ({
            type: 'Fifteen',
            points: 2,
            cards: f
        }))
    }

    function getThirtyOnes(combos) {
        let thirtyOnes = []
        combos.forEach(c => {
            if (getTotal(c) === 31) thirtyOnes.push(c)
        });
        return thirtyOnes.map(t => ({
            type: 'Thirty One',
            points: 2,
            cards: t
        }))
    }

    const combos = combine(hand, 2)
    return [
        ...getStraights(combos),
        ...getPairs(combos),
        ...getFlush(combos),
        ...getFifteens(combos),
        ...getThirtyOnes(combos)
    ]
}