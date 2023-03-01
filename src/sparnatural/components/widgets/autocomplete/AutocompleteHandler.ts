import AbstractHandler from "../AbstractHandler";

export abstract class AbstractSparqlAutocompleteHandler extends AbstractHandler {
  constructor(
    sparqlEndpointUrl: string,
    semanticPostProcess: (sparql: any) => string,
    language: string,
    searchPath: string
  ) {
    super(sparqlEndpointUrl, semanticPostProcess, language, language);
  }

  abstract autocompleteUrl(
    domain: string,
    property: string,
    range: string,
    key: string
  ): string;
}

/**
 * Handles a list widget based on a provided SPARQL query in which
 * $domain, $property and $range will be replaced by actual values.
 **/
export class SparqlTemplateAutocompleteHandler extends AbstractSparqlAutocompleteHandler {
  queryString: any;
  constructor(
    sparqlEndpointUrl: string,
    semanticPostProcess: (sparql: any) => string,
    language: string,
    queryString: string
  ) {
    super(sparqlEndpointUrl, semanticPostProcess, language, null);
    this.queryString = queryString;
  }
  /**
   * Constructs the SPARQL query to use for autocomplete widget search.
   **/
  autocompleteUrl(
    domain: string,
    property: string,
    range: string,
    key: string
  ): string {
    var reDomain = new RegExp("\\$domain", "g");
    var reProperty = new RegExp("\\$property", "g");
    var reRange = new RegExp("\\$range", "g");
    var reLang = new RegExp("\\$lang", "g");
    var reKey = new RegExp("\\$key", "g");

    var sparql = this.queryString
      .replace(reDomain, "<" + domain + ">")
      .replace(reProperty, "<" + property + ">")
      .replace(reRange, "<" + range + ">")
      .replace(reLang, "'" + this.language + "'")
      .replace(reKey, "" + key + "");
    return this.buildURL(sparql);
  }
}