import { p, aw as Ym, ax as mV, ay as hv, ab as I } from './main-4O6JZHHN.js';

var n=class o{#o=p(Ym);#t="https://api1.angular-buch.com";getAll(t){return mV(()=>({url:`${this.#t}/books`,params:{filter:t()}}),{defaultValue:[]})}getSingle(t){return mV(()=>`${this.#t}/books/${t()}`)}remove(t){return this.#o.delete(`${this.#t}/books/${t}`)}create(t){return hv(this.#o.post(`${this.#t}/books`,t))}search(t){return this.#o.get(`${this.#t}/books`,{params:{filter:t}})}static \u0275fac=function(p){return new(p||o)};static \u0275prov=I({token:o,factory:o.\u0275fac,providedIn:"root"})};

export { n };
