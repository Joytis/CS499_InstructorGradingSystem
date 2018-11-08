import EventBus from './eventBus';
import RaceTimer from './race';

// Sends out a request into the aether and hopes for a response from the person who has this.
async function findValueThrough(requestEvent, responseEvent) {
  let item = null;
  let res;
  const resolver = (i) => {
    item = i;
    res();
  };
  // Listen the response, then resolve our object.
  EventBus.$on(responseEvent, resolver);
  const findPromise = new Promise((resolve) => {
    // Set the resolver for our functor.
    res = resolve;
    // request our item.
    EventBus.$emit(requestEvent);
  });

  // Dawg if we don't find that in 20 ms then it's not there lol.
  const timer = RaceTimer(20, findPromise).catch(() => {
    throw new Error(`Couldnt find the item with: ${requestEvent} | ${responseEvent}`);
  });
  await timer;
  // Don't listen for the response anymore.
  EventBus.$off(responseEvent, resolver);
  return item;
}

const SelectedTerm = async () => findValueThrough('request-selected-term', 'response-selected-term');
const SelectedCourse = async () => findValueThrough('request-selected-course', 'response-selected-course');
const SelectedSection = async () => findValueThrough('request-selected-section', 'response-selected-section');
const SelectedAssignmentCategory = async () => findValueThrough('request-selected-asscat', 'response-selected-asscat');
const GemmieAssCats = async () => findValueThrough('request-all-asscat', 'response-all-asscat');

function LoggedInInstructor() {
  return {};
}

export default {
  SelectedTerm,
  SelectedCourse,
  SelectedSection,
  LoggedInInstructor,
  SelectedAssignmentCategory,
  GemmieAssCats,
};
