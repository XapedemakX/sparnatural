import { Props } from "tippy.js";
import { DataSourceResult } from "../components/widgets/AbstractHandler";
import ISettings from "./ISettings";

const defaultSettings: ISettings = {
  langSearch: null,
  config: null,
  language: "en",
  maxDepth: 4, // max amount of where clauses in a branch
  maxOr:3,
  addDistinct: true,
  limit: 1000,
  typePredicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
  defaultEndpoint: null,
  sparqlPrefixes: {
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
  },
  localCacheDataTtl: 1000 * 60 * 60 * 24, // 24 hours in mimmiseconds
  debug:false,
  submitButton:true,
  dataEndpoints:[],
  autocomplete: {

    getData: function(domain:string, property:string, range:string) {
      console.error("Please specify function for getData option in in init parameters of Sparnatural : function(domain, property, range, key) => {label:string, uri:string}")
      return null
    },
    /**
     * This must return the URL that will be called when the user starts
     * typing a few letter in a search field.
     *
     * @param {string} domain - The domain of the criteria currently being edited, i.e. type of the triple subjects.
     * @param {string} property - The predicate of the criteria currently being edited
     * @param {string} range - The range of the criteria currently being edited, i.e. type of the triple objects. This is the class of the entities being searched for.
     * @param {string} key - The letters that the user has typed in the search field.
     **/
    autocompleteUrl: function (
      domain: string,
      property: string,
      range: string,
      key: string
    ) {
      console.error(
        "Please specify function for autocompleteUrl option in in init parameters of Sparnatural : function(domain, property, range, key)"
      );
      return null
    },

    /**
     * Returns the label to display for a single autocomplete result; defaults to `element.label`.
     *
     * @param {object} element - A single autocomplete result
     **/
    elementLabel: function (element: DataSourceResult) {
      return element.label.value;
    },

    /**
     * Returns the URI to of a single autocomplete result; ; defaults to `element.uri`.
     *
     * @param {object} element - A single autocomplete result
     **/
    elementUri: function (element: DataSourceResult) {
      return element.uri.value;
    },
  },
  list: {
    /**
     * This must return the URL that will be called to list the values to populate the dropdown.
     *
     * @param {string} domain - The domain of the criteria currently being edited, i.e. type of the triple subjects.
     * @param {string} property - The predicate of the criteria currently being edited
     * @param {string} range - The range of the criteria currently being edited, i.e. type of the triple objects. This is the class of the entities being searched for.
     **/
    listUrl: function (domain: string, property: string, range: string) {
      console.error(
        "Please specify function for listUrl option in in init parameters of Sparnatural : function(domain, property, range)"
      );
      return null
    },

    /**
     * Returns the path in the returned JSON structure where the list of entries should be read.
     * This is typically the data structure itself, but can correspond to a subentry inside.
     *
     * @param {string} domain - The domain of the criteria currently being edited
     * @param {string} property - The predicate of the criteria currently being edited
     * @param {string} range - The range of the criteria currently being edited
     * @param {object} data - The data structure returned from a list call
     **/
    listLocation: function (domain: string, property: string, range: string, data: { results: { bindings: any }}) {
      return data;
    },

    /**
     * Returns the label to display for a single list entry; defaults to `element.label`.
     *
     * @param {object} element - A single list entry
     **/
    elementLabel: function (element: DataSourceResult) {
      return element.label.value;
    },

    /**
     * Returns the URI for a single list entry; defaults to `element.uri`.
     *
     * @param {object} element - A single list entry
     **/
    elementUri: function (element: DataSourceResult) {
      return element.uri.value;
    },
  },

  dates: {
    datesUrl: function (domain: string, property: string, range: string, key: string) {
      console.error(
        "Please specify function for datesUrl option in in init parameters of Sparnatural : function(domain, property, range, key)"
      );
      return null
    },

    elementLabel: function (element: DataSourceResult) {
      return element.label.value
    },
    elementStart: function (element:{start:{year:number}}) {
      return element.start.year;
    },
    elementEnd: function (element:{stop:{year:number}}) {
      return element.stop.year;
    },
  }
};

// the actual settings, result of merge between defaultSettings and settings passed as parameters
let settings:ISettings;
export function getSettings() {
  return settings;
}

// merge given options with default setting values
export function mergeSettings(options: ISettings) {
  settings = extend(true,{},defaultSettings,options) as ISettings
}

// Pass in the objects to merge as arguments.
// For a deep extend, set the first argument to `true`.
const extend = (deep:boolean,target:{[key:string]:any},...src:Array<{[key:string]:any}>)=> {
  if(target === undefined) target = {}
	// Merge the object into the target object
	var merge = function (obj:{[key:string]:any}) {
    for (const [key, value] of Object.entries(obj)) {
      if((value === undefined)) continue
      if ( Object.prototype.hasOwnProperty.call( obj, key ) ) {
				// If deep merge and property is an object, merge properties
				if ( deep && Object.prototype.toString.call(value) === '[object Object]' ) {
					target[key] = extend( true, target[key], obj[key]);
				} else {
					target[key] = obj[key];
				}
			}
    }
	};
	// Loop through each object and conduct a merge
  src.forEach(o=>{
    merge(o)
  })

	return target;
};

// tooltip configs are constant
export const TOOLTIP_CONFIG : Partial<Props> = {
  allowHTML: true,
  plugins: [] as any[], 
  placement: 'right-start',
  offset: [5, 5],
  theme: 'sparnatural',
  arrow: false,
  delay: [800, 100], //Delay in ms once a trigger event is fired before a tippy shows or hides.
  duration: [200, 200], //Duration in ms of the transition animation.
}
