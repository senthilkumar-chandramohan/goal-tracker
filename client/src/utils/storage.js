const GOALS_KEY = 'goals'

const storeGoals = (goals) => {
    window.localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
}

const retrieveGoals = () => {
    return JSON.parse(window.localStorage.getItem(GOALS_KEY))
}

export {
    storeGoals,
    retrieveGoals,
}
