/**
 * @name DisplayAlbums
 * @description Replaces the default MP3/mu3a etc files with a nicer display
 * @author Kaan
 * @version 1.0.0
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/DisplayAlbums/DisplayAlbums.plugin.js 
 */
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/DisplayAlbums/mp3tag.js
var require_mp3tag = __commonJS({
  "src/DisplayAlbums/mp3tag.js"(exports, module2) {
    "use strict";
    !function(t, r) {
      "object" == typeof exports && "undefined" != typeof module2 ? module2.exports = r() : "function" == typeof define && define.amd ? define(r) : (t = "undefined" != typeof globalThis ? globalThis : t || self).MP3Tag = r();
    }(exports, function() {
      "use strict";
      function t(t2, r2) {
        var e2 = Object.keys(t2);
        if (Object.getOwnPropertySymbols) {
          var n2 = Object.getOwnPropertySymbols(t2);
          r2 && (n2 = n2.filter(function(r3) {
            return Object.getOwnPropertyDescriptor(t2, r3).enumerable;
          })), e2.push.apply(e2, n2);
        }
        return e2;
      }
      function r(r2) {
        for (var e2 = 1; e2 < arguments.length; e2++) {
          var n2 = null != arguments[e2] ? arguments[e2] : {};
          e2 % 2 ? t(Object(n2), true).forEach(function(t2) {
            a(r2, t2, n2[t2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r2, Object.getOwnPropertyDescriptors(n2)) : t(Object(n2)).forEach(function(t2) {
            Object.defineProperty(r2, t2, Object.getOwnPropertyDescriptor(n2, t2));
          });
        }
        return r2;
      }
      function e(t2) {
        return e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t3) {
          return typeof t3;
        } : function(t3) {
          return t3 && "function" == typeof Symbol && t3.constructor === Symbol && t3 !== Symbol.prototype ? "symbol" : typeof t3;
        }, e(t2);
      }
      function n(t2, r2) {
        if (!(t2 instanceof r2)) throw new TypeError("Cannot call a class as a function");
      }
      function i(t2, r2) {
        for (var e2 = 0; e2 < r2.length; e2++) {
          var n2 = r2[e2];
          n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t2, y(n2.key), n2);
        }
      }
      function o(t2, r2, e2) {
        return r2 && i(t2.prototype, r2), e2 && i(t2, e2), Object.defineProperty(t2, "prototype", { writable: false }), t2;
      }
      function a(t2, r2, e2) {
        return (r2 = y(r2)) in t2 ? Object.defineProperty(t2, r2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[r2] = e2, t2;
      }
      function u(t2) {
        return u = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t3) {
          return t3.__proto__ || Object.getPrototypeOf(t3);
        }, u(t2);
      }
      function s(t2, r2) {
        return s = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, r3) {
          return t3.__proto__ = r3, t3;
        }, s(t2, r2);
      }
      function c() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if ("function" == typeof Proxy) return true;
        try {
          return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          })), true;
        } catch (t2) {
          return false;
        }
      }
      function f(t2, r2, e2) {
        return f = c() ? Reflect.construct.bind() : function(t3, r3, e3) {
          var n2 = [null];
          n2.push.apply(n2, r3);
          var i2 = new (Function.bind.apply(t3, n2))();
          return e3 && s(i2, e3.prototype), i2;
        }, f.apply(null, arguments);
      }
      function l(t2) {
        var r2 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
        return l = function(t3) {
          if (null === t3 || (e2 = t3, -1 === Function.toString.call(e2).indexOf("[native code]"))) return t3;
          var e2;
          if ("function" != typeof t3) throw new TypeError("Super expression must either be null or a function");
          if (void 0 !== r2) {
            if (r2.has(t3)) return r2.get(t3);
            r2.set(t3, n2);
          }
          function n2() {
            return f(t3, arguments, u(this).constructor);
          }
          return n2.prototype = Object.create(t3.prototype, { constructor: { value: n2, enumerable: false, writable: true, configurable: true } }), s(n2, t3);
        }, l(t2);
      }
      function v(t2, r2) {
        if (r2 && ("object" == typeof r2 || "function" == typeof r2)) return r2;
        if (void 0 !== r2) throw new TypeError("Derived constructors may only return object or undefined");
        return function(t3) {
          if (void 0 === t3) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return t3;
        }(t2);
      }
      function h(t2) {
        return function(t3) {
          if (Array.isArray(t3)) return g(t3);
        }(t2) || function(t3) {
          if ("undefined" != typeof Symbol && null != t3[Symbol.iterator] || null != t3["@@iterator"]) return Array.from(t3);
        }(t2) || d(t2) || function() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function d(t2, r2) {
        if (t2) {
          if ("string" == typeof t2) return g(t2, r2);
          var e2 = Object.prototype.toString.call(t2).slice(8, -1);
          return "Object" === e2 && t2.constructor && (e2 = t2.constructor.name), "Map" === e2 || "Set" === e2 ? Array.from(t2) : "Arguments" === e2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e2) ? g(t2, r2) : void 0;
        }
      }
      function g(t2, r2) {
        (null == r2 || r2 > t2.length) && (r2 = t2.length);
        for (var e2 = 0, n2 = new Array(r2); e2 < r2; e2++) n2[e2] = t2[e2];
        return n2;
      }
      function p(t2, r2) {
        var e2 = "undefined" != typeof Symbol && t2[Symbol.iterator] || t2["@@iterator"];
        if (!e2) {
          if (Array.isArray(t2) || (e2 = d(t2)) || r2 && t2 && "number" == typeof t2.length) {
            e2 && (t2 = e2);
            var n2 = 0, i2 = function() {
            };
            return { s: i2, n: function() {
              return n2 >= t2.length ? { done: true } : { done: false, value: t2[n2++] };
            }, e: function(t3) {
              throw t3;
            }, f: i2 };
          }
          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        var o2, a2 = true, u2 = false;
        return { s: function() {
          e2 = e2.call(t2);
        }, n: function() {
          var t3 = e2.next();
          return a2 = t3.done, t3;
        }, e: function(t3) {
          u2 = true, o2 = t3;
        }, f: function() {
          try {
            a2 || null == e2.return || e2.return();
          } finally {
            if (u2) throw o2;
          }
        } };
      }
      function y(t2) {
        var r2 = function(t3, r3) {
          if ("object" != typeof t3 || null === t3) return t3;
          var e2 = t3[Symbol.toPrimitive];
          if (void 0 !== e2) {
            var n2 = e2.call(t3, r3 || "default");
            if ("object" != typeof n2) return n2;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === r3 ? String : Number)(t3);
        }(t2, "string");
        return "symbol" == typeof r2 ? r2 : String(r2);
      }
      var w = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, b = function(t2) {
        return t2 && t2.Math === Math && t2;
      }, m = b("object" == typeof globalThis && globalThis) || b("object" == typeof window && window) || b("object" == typeof self && self) || b("object" == typeof w && w) || /* @__PURE__ */ function() {
        return this;
      }() || w || Function("return this")(), E = {}, A = function(t2) {
        try {
          return !!t2();
        } catch (t3) {
          return true;
        }
      }, T = !A(function() {
        return 7 !== Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1];
      }), S = !A(function() {
        var t2 = function() {
        }.bind();
        return "function" != typeof t2 || t2.hasOwnProperty("prototype");
      }), I = S, O = Function.prototype.call, x = I ? O.bind(O) : function() {
        return O.apply(O, arguments);
      }, k = {}, P = {}.propertyIsEnumerable, R = Object.getOwnPropertyDescriptor, C = R && !P.call({ 1: 2 }, 1);
      k.f = C ? function(t2) {
        var r2 = R(this, t2);
        return !!r2 && r2.enumerable;
      } : P;
      var U, L, M = function(t2, r2) {
        return { enumerable: !(1 & t2), configurable: !(2 & t2), writable: !(4 & t2), value: r2 };
      }, D = S, j = Function.prototype, B = j.call, F = D && j.bind.bind(B, B), N = D ? F : function(t2) {
        return function() {
          return B.apply(t2, arguments);
        };
      }, _ = N, V = _({}.toString), W = _("".slice), G = function(t2) {
        return W(V(t2), 8, -1);
      }, Y = A, $ = G, z = Object, K = N("".split), H = Y(function() {
        return !z("z").propertyIsEnumerable(0);
      }) ? function(t2) {
        return "String" === $(t2) ? K(t2, "") : z(t2);
      } : z, X = function(t2) {
        return null == t2;
      }, J = X, Z = TypeError, q = function(t2) {
        if (J(t2)) throw Z("Can't call method on " + t2);
        return t2;
      }, Q = H, tt = q, rt = function(t2) {
        return Q(tt(t2));
      }, et = "object" == typeof document && document.all, nt = { all: et, IS_HTMLDDA: void 0 === et && void 0 !== et }, it = nt.all, ot = nt.IS_HTMLDDA ? function(t2) {
        return "function" == typeof t2 || t2 === it;
      } : function(t2) {
        return "function" == typeof t2;
      }, at = ot, ut = nt.all, st = nt.IS_HTMLDDA ? function(t2) {
        return "object" == typeof t2 ? null !== t2 : at(t2) || t2 === ut;
      } : function(t2) {
        return "object" == typeof t2 ? null !== t2 : at(t2);
      }, ct = m, ft = ot, lt = function(t2, r2) {
        return arguments.length < 2 ? (e2 = ct[t2], ft(e2) ? e2 : void 0) : ct[t2] && ct[t2][r2];
        var e2;
      }, vt = N({}.isPrototypeOf), ht = "undefined" != typeof navigator && String(navigator.userAgent) || "", dt = m, gt = ht, pt = dt.process, yt = dt.Deno, wt = pt && pt.versions || yt && yt.version, bt = wt && wt.v8;
      bt && (L = (U = bt.split("."))[0] > 0 && U[0] < 4 ? 1 : +(U[0] + U[1])), !L && gt && (!(U = gt.match(/Edge\/(\d+)/)) || U[1] >= 74) && (U = gt.match(/Chrome\/(\d+)/)) && (L = +U[1]);
      var mt = L, Et = mt, At = A, Tt = m.String, St = !!Object.getOwnPropertySymbols && !At(function() {
        var t2 = Symbol("symbol detection");
        return !Tt(t2) || !(Object(t2) instanceof Symbol) || !Symbol.sham && Et && Et < 41;
      }), It = St && !Symbol.sham && "symbol" == typeof Symbol.iterator, Ot = lt, xt = ot, kt = vt, Pt = Object, Rt = It ? function(t2) {
        return "symbol" == typeof t2;
      } : function(t2) {
        var r2 = Ot("Symbol");
        return xt(r2) && kt(r2.prototype, Pt(t2));
      }, Ct = String, Ut = function(t2) {
        try {
          return Ct(t2);
        } catch (t3) {
          return "Object";
        }
      }, Lt = ot, Mt = Ut, Dt = TypeError, jt = function(t2) {
        if (Lt(t2)) return t2;
        throw Dt(Mt(t2) + " is not a function");
      }, Bt = jt, Ft = X, Nt = function(t2, r2) {
        var e2 = t2[r2];
        return Ft(e2) ? void 0 : Bt(e2);
      }, _t = x, Vt = ot, Wt = st, Gt = TypeError, Yt = { exports: {} }, $t = m, zt = Object.defineProperty, Kt = function(t2, r2) {
        try {
          zt($t, t2, { value: r2, configurable: true, writable: true });
        } catch (e2) {
          $t[t2] = r2;
        }
        return r2;
      }, Ht = Kt, Xt = "__core-js_shared__", Jt = m[Xt] || Ht(Xt, {}), Zt = Jt;
      (Yt.exports = function(t2, r2) {
        return Zt[t2] || (Zt[t2] = void 0 !== r2 ? r2 : {});
      })("versions", []).push({ version: "3.32.2", mode: "global", copyright: "\xA9 2014-2023 Denis Pushkarev (zloirock.ru)", license: "https://github.com/zloirock/core-js/blob/v3.32.2/LICENSE", source: "https://github.com/zloirock/core-js" });
      var qt = Yt.exports, Qt = q, tr = Object, rr = function(t2) {
        return tr(Qt(t2));
      }, er = rr, nr = N({}.hasOwnProperty), ir = Object.hasOwn || function(t2, r2) {
        return nr(er(t2), r2);
      }, or = N, ar = 0, ur = Math.random(), sr = or(1 .toString), cr = function(t2) {
        return "Symbol(" + (void 0 === t2 ? "" : t2) + ")_" + sr(++ar + ur, 36);
      }, fr = qt, lr = ir, vr = cr, hr = St, dr = It, gr = m.Symbol, pr = fr("wks"), yr = dr ? gr.for || gr : gr && gr.withoutSetter || vr, wr = function(t2) {
        return lr(pr, t2) || (pr[t2] = hr && lr(gr, t2) ? gr[t2] : yr("Symbol." + t2)), pr[t2];
      }, br = x, mr = st, Er = Rt, Ar = Nt, Tr = function(t2, r2) {
        var e2, n2;
        if ("string" === r2 && Vt(e2 = t2.toString) && !Wt(n2 = _t(e2, t2))) return n2;
        if (Vt(e2 = t2.valueOf) && !Wt(n2 = _t(e2, t2))) return n2;
        if ("string" !== r2 && Vt(e2 = t2.toString) && !Wt(n2 = _t(e2, t2))) return n2;
        throw Gt("Can't convert object to primitive value");
      }, Sr = TypeError, Ir = wr("toPrimitive"), Or = function(t2, r2) {
        if (!mr(t2) || Er(t2)) return t2;
        var e2, n2 = Ar(t2, Ir);
        if (n2) {
          if (void 0 === r2 && (r2 = "default"), e2 = br(n2, t2, r2), !mr(e2) || Er(e2)) return e2;
          throw Sr("Can't convert object to primitive value");
        }
        return void 0 === r2 && (r2 = "number"), Tr(t2, r2);
      }, xr = Or, kr = Rt, Pr = function(t2) {
        var r2 = xr(t2, "string");
        return kr(r2) ? r2 : r2 + "";
      }, Rr = st, Cr = m.document, Ur = Rr(Cr) && Rr(Cr.createElement), Lr = function(t2) {
        return Ur ? Cr.createElement(t2) : {};
      }, Mr = Lr, Dr = !T && !A(function() {
        return 7 !== Object.defineProperty(Mr("div"), "a", { get: function() {
          return 7;
        } }).a;
      }), jr = T, Br = x, Fr = k, Nr = M, _r = rt, Vr = Pr, Wr = ir, Gr = Dr, Yr = Object.getOwnPropertyDescriptor;
      E.f = jr ? Yr : function(t2, r2) {
        if (t2 = _r(t2), r2 = Vr(r2), Gr) try {
          return Yr(t2, r2);
        } catch (t3) {
        }
        if (Wr(t2, r2)) return Nr(!Br(Fr.f, t2, r2), t2[r2]);
      };
      var $r = {}, zr = T && A(function() {
        return 42 !== Object.defineProperty(function() {
        }, "prototype", { value: 42, writable: false }).prototype;
      }), Kr = st, Hr = String, Xr = TypeError, Jr = function(t2) {
        if (Kr(t2)) return t2;
        throw Xr(Hr(t2) + " is not an object");
      }, Zr = T, qr = Dr, Qr = zr, te = Jr, re = Pr, ee = TypeError, ne = Object.defineProperty, ie = Object.getOwnPropertyDescriptor, oe = "enumerable", ae = "configurable", ue = "writable";
      $r.f = Zr ? Qr ? function(t2, r2, e2) {
        if (te(t2), r2 = re(r2), te(e2), "function" == typeof t2 && "prototype" === r2 && "value" in e2 && ue in e2 && !e2[ue]) {
          var n2 = ie(t2, r2);
          n2 && n2[ue] && (t2[r2] = e2.value, e2 = { configurable: ae in e2 ? e2[ae] : n2[ae], enumerable: oe in e2 ? e2[oe] : n2[oe], writable: false });
        }
        return ne(t2, r2, e2);
      } : ne : function(t2, r2, e2) {
        if (te(t2), r2 = re(r2), te(e2), qr) try {
          return ne(t2, r2, e2);
        } catch (t3) {
        }
        if ("get" in e2 || "set" in e2) throw ee("Accessors not supported");
        return "value" in e2 && (t2[r2] = e2.value), t2;
      };
      var se = $r, ce = M, fe = T ? function(t2, r2, e2) {
        return se.f(t2, r2, ce(1, e2));
      } : function(t2, r2, e2) {
        return t2[r2] = e2, t2;
      }, le = { exports: {} }, ve = T, he = ir, de = Function.prototype, ge = ve && Object.getOwnPropertyDescriptor, pe = he(de, "name"), ye = { EXISTS: pe, PROPER: pe && "something" === function() {
      }.name, CONFIGURABLE: pe && (!ve || ve && ge(de, "name").configurable) }, we = ot, be = Jt, me = N(Function.toString);
      we(be.inspectSource) || (be.inspectSource = function(t2) {
        return me(t2);
      });
      var Ee, Ae, Te, Se = be.inspectSource, Ie = ot, Oe = m.WeakMap, xe = Ie(Oe) && /native code/.test(String(Oe)), ke = cr, Pe = qt("keys"), Re = function(t2) {
        return Pe[t2] || (Pe[t2] = ke(t2));
      }, Ce = {}, Ue = xe, Le = m, Me = st, De = fe, je = ir, Be = Jt, Fe = Re, Ne = Ce, _e = "Object already initialized", Ve = Le.TypeError, We = Le.WeakMap;
      if (Ue || Be.state) {
        var Ge = Be.state || (Be.state = new We());
        Ge.get = Ge.get, Ge.has = Ge.has, Ge.set = Ge.set, Ee = function(t2, r2) {
          if (Ge.has(t2)) throw Ve(_e);
          return r2.facade = t2, Ge.set(t2, r2), r2;
        }, Ae = function(t2) {
          return Ge.get(t2) || {};
        }, Te = function(t2) {
          return Ge.has(t2);
        };
      } else {
        var Ye = Fe("state");
        Ne[Ye] = true, Ee = function(t2, r2) {
          if (je(t2, Ye)) throw Ve(_e);
          return r2.facade = t2, De(t2, Ye, r2), r2;
        }, Ae = function(t2) {
          return je(t2, Ye) ? t2[Ye] : {};
        }, Te = function(t2) {
          return je(t2, Ye);
        };
      }
      var $e = { set: Ee, get: Ae, has: Te, enforce: function(t2) {
        return Te(t2) ? Ae(t2) : Ee(t2, {});
      }, getterFor: function(t2) {
        return function(r2) {
          var e2;
          if (!Me(r2) || (e2 = Ae(r2)).type !== t2) throw Ve("Incompatible receiver, " + t2 + " required");
          return e2;
        };
      } }, ze = N, Ke = A, He = ot, Xe = ir, Je = T, Ze = ye.CONFIGURABLE, qe = Se, Qe = $e.enforce, tn = $e.get, rn = String, en = Object.defineProperty, nn = ze("".slice), on = ze("".replace), an = ze([].join), un = Je && !Ke(function() {
        return 8 !== en(function() {
        }, "length", { value: 8 }).length;
      }), sn = String(String).split("String"), cn = le.exports = function(t2, r2, e2) {
        "Symbol(" === nn(rn(r2), 0, 7) && (r2 = "[" + on(rn(r2), /^Symbol\(([^)]*)\)/, "$1") + "]"), e2 && e2.getter && (r2 = "get " + r2), e2 && e2.setter && (r2 = "set " + r2), (!Xe(t2, "name") || Ze && t2.name !== r2) && (Je ? en(t2, "name", { value: r2, configurable: true }) : t2.name = r2), un && e2 && Xe(e2, "arity") && t2.length !== e2.arity && en(t2, "length", { value: e2.arity });
        try {
          e2 && Xe(e2, "constructor") && e2.constructor ? Je && en(t2, "prototype", { writable: false }) : t2.prototype && (t2.prototype = void 0);
        } catch (t3) {
        }
        var n2 = Qe(t2);
        return Xe(n2, "source") || (n2.source = an(sn, "string" == typeof r2 ? r2 : "")), t2;
      };
      Function.prototype.toString = cn(function() {
        return He(this) && tn(this).source || qe(this);
      }, "toString");
      var fn = le.exports, ln = ot, vn = $r, hn = fn, dn = Kt, gn = function(t2, r2, e2, n2) {
        n2 || (n2 = {});
        var i2 = n2.enumerable, o2 = void 0 !== n2.name ? n2.name : r2;
        if (ln(e2) && hn(e2, o2, n2), n2.global) i2 ? t2[r2] = e2 : dn(r2, e2);
        else {
          try {
            n2.unsafe ? t2[r2] && (i2 = true) : delete t2[r2];
          } catch (t3) {
          }
          i2 ? t2[r2] = e2 : vn.f(t2, r2, { value: e2, enumerable: false, configurable: !n2.nonConfigurable, writable: !n2.nonWritable });
        }
        return t2;
      }, pn = {}, yn = Math.ceil, wn = Math.floor, bn = Math.trunc || function(t2) {
        var r2 = +t2;
        return (r2 > 0 ? wn : yn)(r2);
      }, mn = bn, En = function(t2) {
        var r2 = +t2;
        return r2 != r2 || 0 === r2 ? 0 : mn(r2);
      }, An = En, Tn = Math.max, Sn = Math.min, In = function(t2, r2) {
        var e2 = An(t2);
        return e2 < 0 ? Tn(e2 + r2, 0) : Sn(e2, r2);
      }, On = En, xn = Math.min, kn = function(t2) {
        return t2 > 0 ? xn(On(t2), 9007199254740991) : 0;
      }, Pn = kn, Rn = function(t2) {
        return Pn(t2.length);
      }, Cn = rt, Un = In, Ln = Rn, Mn = function(t2) {
        return function(r2, e2, n2) {
          var i2, o2 = Cn(r2), a2 = Ln(o2), u2 = Un(n2, a2);
          if (t2 && e2 != e2) {
            for (; a2 > u2; ) if ((i2 = o2[u2++]) != i2) return true;
          } else for (; a2 > u2; u2++) if ((t2 || u2 in o2) && o2[u2] === e2) return t2 || u2 || 0;
          return !t2 && -1;
        };
      }, Dn = { includes: Mn(true), indexOf: Mn(false) }, jn = ir, Bn = rt, Fn = Dn.indexOf, Nn = Ce, _n = N([].push), Vn = function(t2, r2) {
        var e2, n2 = Bn(t2), i2 = 0, o2 = [];
        for (e2 in n2) !jn(Nn, e2) && jn(n2, e2) && _n(o2, e2);
        for (; r2.length > i2; ) jn(n2, e2 = r2[i2++]) && (~Fn(o2, e2) || _n(o2, e2));
        return o2;
      }, Wn = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"], Gn = Vn, Yn = Wn.concat("length", "prototype");
      pn.f = Object.getOwnPropertyNames || function(t2) {
        return Gn(t2, Yn);
      };
      var $n = {};
      $n.f = Object.getOwnPropertySymbols;
      var zn = lt, Kn = pn, Hn = $n, Xn = Jr, Jn = N([].concat), Zn = zn("Reflect", "ownKeys") || function(t2) {
        var r2 = Kn.f(Xn(t2)), e2 = Hn.f;
        return e2 ? Jn(r2, e2(t2)) : r2;
      }, qn = ir, Qn = Zn, ti = E, ri = $r, ei = function(t2, r2, e2) {
        for (var n2 = Qn(r2), i2 = ri.f, o2 = ti.f, a2 = 0; a2 < n2.length; a2++) {
          var u2 = n2[a2];
          qn(t2, u2) || e2 && qn(e2, u2) || i2(t2, u2, o2(r2, u2));
        }
      }, ni = A, ii = ot, oi = /#|\.prototype\./, ai = function(t2, r2) {
        var e2 = si[ui(t2)];
        return e2 === fi || e2 !== ci && (ii(r2) ? ni(r2) : !!r2);
      }, ui = ai.normalize = function(t2) {
        return String(t2).replace(oi, ".").toLowerCase();
      }, si = ai.data = {}, ci = ai.NATIVE = "N", fi = ai.POLYFILL = "P", li = ai, vi = m, hi = E.f, di = fe, gi = gn, pi = Kt, yi = ei, wi = li, bi = function(t2, r2) {
        var e2, n2, i2, o2, a2, u2 = t2.target, s2 = t2.global, c2 = t2.stat;
        if (e2 = s2 ? vi : c2 ? vi[u2] || pi(u2, {}) : (vi[u2] || {}).prototype) for (n2 in r2) {
          if (o2 = r2[n2], i2 = t2.dontCallGetSet ? (a2 = hi(e2, n2)) && a2.value : e2[n2], !wi(s2 ? n2 : u2 + (c2 ? "." : "#") + n2, t2.forced) && void 0 !== i2) {
            if (typeof o2 == typeof i2) continue;
            yi(o2, i2);
          }
          (t2.sham || i2 && i2.sham) && di(o2, "sham", true), gi(e2, n2, o2, t2);
        }
      }, mi = {}, Ei = Vn, Ai = Wn, Ti = Object.keys || function(t2) {
        return Ei(t2, Ai);
      }, Si = T, Ii = zr, Oi = $r, xi = Jr, ki = rt, Pi = Ti;
      mi.f = Si && !Ii ? Object.defineProperties : function(t2, r2) {
        xi(t2);
        for (var e2, n2 = ki(r2), i2 = Pi(r2), o2 = i2.length, a2 = 0; o2 > a2; ) Oi.f(t2, e2 = i2[a2++], n2[e2]);
        return t2;
      };
      var Ri = bi, Ci = T, Ui = mi.f;
      Ri({ target: "Object", stat: true, forced: Object.defineProperties !== Ui, sham: !Ci }, { defineProperties: Ui });
      var Li = G, Mi = Array.isArray || function(t2) {
        return "Array" === Li(t2);
      };
      bi({ target: "Array", stat: true }, { isArray: Mi });
      var Di, ji = lt("document", "documentElement"), Bi = Jr, Fi = mi, Ni = Wn, _i = Ce, Vi = ji, Wi = Lr, Gi = "prototype", Yi = "script", $i = Re("IE_PROTO"), zi = function() {
      }, Ki = function(t2) {
        return "<" + Yi + ">" + t2 + "</" + Yi + ">";
      }, Hi = function(t2) {
        t2.write(Ki("")), t2.close();
        var r2 = t2.parentWindow.Object;
        return t2 = null, r2;
      }, Xi = function() {
        try {
          Di = new ActiveXObject("htmlfile");
        } catch (t3) {
        }
        var t2, r2, e2;
        Xi = "undefined" != typeof document ? document.domain && Di ? Hi(Di) : (r2 = Wi("iframe"), e2 = "java" + Yi + ":", r2.style.display = "none", Vi.appendChild(r2), r2.src = String(e2), (t2 = r2.contentWindow.document).open(), t2.write(Ki("document.F=Object")), t2.close(), t2.F) : Hi(Di);
        for (var n2 = Ni.length; n2--; ) delete Xi[Gi][Ni[n2]];
        return Xi();
      };
      _i[$i] = true;
      var Ji = Object.create || function(t2, r2) {
        var e2;
        return null !== t2 ? (zi[Gi] = Bi(t2), e2 = new zi(), zi[Gi] = null, e2[$i] = t2) : e2 = Xi(), void 0 === r2 ? e2 : Fi.f(e2, r2);
      }, Zi = wr, qi = Ji, Qi = $r.f, to = Zi("unscopables"), ro = Array.prototype;
      void 0 === ro[to] && Qi(ro, to, { configurable: true, value: qi(null) });
      var eo, no, io, oo = function(t2) {
        ro[to][t2] = true;
      }, ao = {}, uo = !A(function() {
        function t2() {
        }
        return t2.prototype.constructor = null, Object.getPrototypeOf(new t2()) !== t2.prototype;
      }), so = ir, co = ot, fo = rr, lo = uo, vo = Re("IE_PROTO"), ho = Object, go = ho.prototype, po = lo ? ho.getPrototypeOf : function(t2) {
        var r2 = fo(t2);
        if (so(r2, vo)) return r2[vo];
        var e2 = r2.constructor;
        return co(e2) && r2 instanceof e2 ? e2.prototype : r2 instanceof ho ? go : null;
      }, yo = A, wo = ot, bo = st, mo = po, Eo = gn, Ao = wr("iterator"), To = false;
      [].keys && ("next" in (io = [].keys()) ? (no = mo(mo(io))) !== Object.prototype && (eo = no) : To = true);
      var So = !bo(eo) || yo(function() {
        var t2 = {};
        return eo[Ao].call(t2) !== t2;
      });
      So && (eo = {}), wo(eo[Ao]) || Eo(eo, Ao, function() {
        return this;
      });
      var Io = { IteratorPrototype: eo, BUGGY_SAFARI_ITERATORS: To }, Oo = $r.f, xo = ir, ko = wr("toStringTag"), Po = function(t2, r2, e2) {
        t2 && !e2 && (t2 = t2.prototype), t2 && !xo(t2, ko) && Oo(t2, ko, { configurable: true, value: r2 });
      }, Ro = Io.IteratorPrototype, Co = Ji, Uo = M, Lo = Po, Mo = ao, Do = function() {
        return this;
      }, jo = N, Bo = jt, Fo = ot, No = String, _o = TypeError, Vo = function(t2, r2, e2) {
        try {
          return jo(Bo(Object.getOwnPropertyDescriptor(t2, r2)[e2]));
        } catch (t3) {
        }
      }, Wo = Jr, Go = function(t2) {
        if ("object" == typeof t2 || Fo(t2)) return t2;
        throw _o("Can't set " + No(t2) + " as a prototype");
      }, Yo = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var t2, r2 = false, e2 = {};
        try {
          (t2 = Vo(Object.prototype, "__proto__", "set"))(e2, []), r2 = e2 instanceof Array;
        } catch (t3) {
        }
        return function(e3, n2) {
          return Wo(e3), Go(n2), r2 ? t2(e3, n2) : e3.__proto__ = n2, e3;
        };
      }() : void 0), $o = bi, zo = x, Ko = ot, Ho = function(t2, r2, e2, n2) {
        var i2 = r2 + " Iterator";
        return t2.prototype = Co(Ro, { next: Uo(+!n2, e2) }), Lo(t2, i2, false), Mo[i2] = Do, t2;
      }, Xo = po, Jo = Yo, Zo = Po, qo = fe, Qo = gn, ta = ao, ra = ye.PROPER, ea = ye.CONFIGURABLE, na = Io.IteratorPrototype, ia = Io.BUGGY_SAFARI_ITERATORS, oa = wr("iterator"), aa = "keys", ua = "values", sa = "entries", ca = function() {
        return this;
      }, fa = function(t2, r2, e2, n2, i2, o2, a2) {
        Ho(e2, r2, n2);
        var u2, s2, c2, f2 = function(t3) {
          if (t3 === i2 && g2) return g2;
          if (!ia && t3 && t3 in h2) return h2[t3];
          switch (t3) {
            case aa:
            case ua:
            case sa:
              return function() {
                return new e2(this, t3);
              };
          }
          return function() {
            return new e2(this);
          };
        }, l2 = r2 + " Iterator", v2 = false, h2 = t2.prototype, d2 = h2[oa] || h2["@@iterator"] || i2 && h2[i2], g2 = !ia && d2 || f2(i2), p2 = "Array" === r2 && h2.entries || d2;
        if (p2 && (u2 = Xo(p2.call(new t2()))) !== Object.prototype && u2.next && (Xo(u2) !== na && (Jo ? Jo(u2, na) : Ko(u2[oa]) || Qo(u2, oa, ca)), Zo(u2, l2, true)), ra && i2 === ua && d2 && d2.name !== ua && (ea ? qo(h2, "name", ua) : (v2 = true, g2 = function() {
          return zo(d2, this);
        })), i2) if (s2 = { values: f2(ua), keys: o2 ? g2 : f2(aa), entries: f2(sa) }, a2) for (c2 in s2) (ia || v2 || !(c2 in h2)) && Qo(h2, c2, s2[c2]);
        else $o({ target: r2, proto: true, forced: ia || v2 }, s2);
        return h2[oa] !== g2 && Qo(h2, oa, g2, { name: i2 }), ta[r2] = g2, s2;
      }, la = function(t2, r2) {
        return { value: t2, done: r2 };
      }, va = rt, ha = oo, da = ao, ga = $e, pa = $r.f, ya = fa, wa = la, ba = T, ma = "Array Iterator", Ea = ga.set, Aa = ga.getterFor(ma), Ta = ya(Array, "Array", function(t2, r2) {
        Ea(this, { type: ma, target: va(t2), index: 0, kind: r2 });
      }, function() {
        var t2 = Aa(this), r2 = t2.target, e2 = t2.kind, n2 = t2.index++;
        if (!r2 || n2 >= r2.length) return t2.target = void 0, wa(void 0, true);
        switch (e2) {
          case "keys":
            return wa(n2, false);
          case "values":
            return wa(r2[n2], false);
        }
        return wa([n2, r2[n2]], false);
      }, "values"), Sa = da.Arguments = da.Array;
      if (ha("keys"), ha("values"), ha("entries"), ba && "values" !== Sa.name) try {
        pa(Sa, "name", { value: "values" });
      } catch (t2) {
      }
      var Ia = G, Oa = N, xa = function(t2) {
        if ("Function" === Ia(t2)) return Oa(t2);
      }, ka = "undefined" != typeof ArrayBuffer && "undefined" != typeof DataView, Pa = fn, Ra = $r, Ca = function(t2, r2, e2) {
        return e2.get && Pa(e2.get, r2, { getter: true }), e2.set && Pa(e2.set, r2, { setter: true }), Ra.f(t2, r2, e2);
      }, Ua = gn, La = vt, Ma = TypeError, Da = function(t2, r2) {
        if (La(r2, t2)) return t2;
        throw Ma("Incorrect invocation");
      }, ja = En, Ba = kn, Fa = RangeError, Na = function(t2) {
        if (void 0 === t2) return 0;
        var r2 = ja(t2), e2 = Ba(r2);
        if (r2 !== e2) throw Fa("Wrong length or index");
        return e2;
      }, _a = Math.sign || function(t2) {
        var r2 = +t2;
        return 0 === r2 || r2 != r2 ? r2 : r2 < 0 ? -1 : 1;
      }, Va = bn, Wa = Array, Ga = Math.abs, Ya = Math.pow, $a = Math.floor, za = Math.log, Ka = Math.LN2, Ha = function(t2) {
        var r2 = Va(t2), e2 = Ga(t2 - r2);
        return e2 > 0.5 || 0.5 === e2 && r2 % 2 != 0 ? r2 + _a(t2) : r2;
      }, Xa = { pack: function(t2, r2, e2) {
        var n2, i2, o2, a2 = Wa(e2), u2 = 8 * e2 - r2 - 1, s2 = (1 << u2) - 1, c2 = s2 >> 1, f2 = 23 === r2 ? Ya(2, -24) - Ya(2, -77) : 0, l2 = t2 < 0 || 0 === t2 && 1 / t2 < 0 ? 1 : 0, v2 = 0;
        for ((t2 = Ga(t2)) != t2 || t2 === 1 / 0 ? (i2 = t2 != t2 ? 1 : 0, n2 = s2) : (n2 = $a(za(t2) / Ka), t2 * (o2 = Ya(2, -n2)) < 1 && (n2--, o2 *= 2), (t2 += n2 + c2 >= 1 ? f2 / o2 : f2 * Ya(2, 1 - c2)) * o2 >= 2 && (n2++, o2 /= 2), n2 + c2 >= s2 ? (i2 = 0, n2 = s2) : n2 + c2 >= 1 ? (i2 = Ha((t2 * o2 - 1) * Ya(2, r2)), n2 += c2) : (i2 = Ha(t2 * Ya(2, c2 - 1) * Ya(2, r2)), n2 = 0)); r2 >= 8; ) a2[v2++] = 255 & i2, i2 /= 256, r2 -= 8;
        for (n2 = n2 << r2 | i2, u2 += r2; u2 > 0; ) a2[v2++] = 255 & n2, n2 /= 256, u2 -= 8;
        return a2[--v2] |= 128 * l2, a2;
      }, unpack: function(t2, r2) {
        var e2, n2 = t2.length, i2 = 8 * n2 - r2 - 1, o2 = (1 << i2) - 1, a2 = o2 >> 1, u2 = i2 - 7, s2 = n2 - 1, c2 = t2[s2--], f2 = 127 & c2;
        for (c2 >>= 7; u2 > 0; ) f2 = 256 * f2 + t2[s2--], u2 -= 8;
        for (e2 = f2 & (1 << -u2) - 1, f2 >>= -u2, u2 += r2; u2 > 0; ) e2 = 256 * e2 + t2[s2--], u2 -= 8;
        if (0 === f2) f2 = 1 - a2;
        else {
          if (f2 === o2) return e2 ? NaN : c2 ? -1 / 0 : 1 / 0;
          e2 += Ya(2, r2), f2 -= a2;
        }
        return (c2 ? -1 : 1) * e2 * Ya(2, f2 - r2);
      } }, Ja = rr, Za = In, qa = Rn, Qa = function(t2) {
        for (var r2 = Ja(this), e2 = qa(r2), n2 = arguments.length, i2 = Za(n2 > 1 ? arguments[1] : void 0, e2), o2 = n2 > 2 ? arguments[2] : void 0, a2 = void 0 === o2 ? e2 : Za(o2, e2); a2 > i2; ) r2[i2++] = t2;
        return r2;
      }, tu = Pr, ru = $r, eu = M, nu = function(t2, r2, e2) {
        var n2 = tu(r2);
        n2 in t2 ? ru.f(t2, n2, eu(0, e2)) : t2[n2] = e2;
      }, iu = In, ou = Rn, au = nu, uu = Array, su = Math.max, cu = function(t2, r2, e2) {
        for (var n2 = ou(t2), i2 = iu(r2, n2), o2 = iu(void 0 === e2 ? n2 : e2, n2), a2 = uu(su(o2 - i2, 0)), u2 = 0; i2 < o2; i2++, u2++) au(a2, u2, t2[i2]);
        return a2.length = u2, a2;
      }, fu = m, lu = N, vu = T, hu = ka, du = ye, gu = fe, pu = Ca, yu = function(t2, r2, e2) {
        for (var n2 in r2) Ua(t2, n2, r2[n2], e2);
        return t2;
      }, wu = A, bu = Da, mu = En, Eu = kn, Au = Na, Tu = Xa, Su = po, Iu = Yo, Ou = pn.f, xu = Qa, ku = cu, Pu = Po, Ru = $e, Cu = du.PROPER, Uu = du.CONFIGURABLE, Lu = "ArrayBuffer", Mu = "DataView", Du = "prototype", ju = "Wrong index", Bu = Ru.getterFor(Lu), Fu = Ru.getterFor(Mu), Nu = Ru.set, _u = fu[Lu], Vu = _u, Wu = Vu && Vu[Du], Gu = fu[Mu], Yu = Gu && Gu[Du], $u = Object.prototype, zu = fu.Array, Ku = fu.RangeError, Hu = lu(xu), Xu = lu([].reverse), Ju = Tu.pack, Zu = Tu.unpack, qu = function(t2) {
        return [255 & t2];
      }, Qu = function(t2) {
        return [255 & t2, t2 >> 8 & 255];
      }, ts = function(t2) {
        return [255 & t2, t2 >> 8 & 255, t2 >> 16 & 255, t2 >> 24 & 255];
      }, rs = function(t2) {
        return t2[3] << 24 | t2[2] << 16 | t2[1] << 8 | t2[0];
      }, es = function(t2) {
        return Ju(t2, 23, 4);
      }, ns = function(t2) {
        return Ju(t2, 52, 8);
      }, is = function(t2, r2, e2) {
        pu(t2[Du], r2, { configurable: true, get: function() {
          return e2(this)[r2];
        } });
      }, os = function(t2, r2, e2, n2) {
        var i2 = Fu(t2), o2 = Au(e2), a2 = !!n2;
        if (o2 + r2 > i2.byteLength) throw Ku(ju);
        var u2 = i2.bytes, s2 = o2 + i2.byteOffset, c2 = ku(u2, s2, s2 + r2);
        return a2 ? c2 : Xu(c2);
      }, as = function(t2, r2, e2, n2, i2, o2) {
        var a2 = Fu(t2), u2 = Au(e2), s2 = n2(+i2), c2 = !!o2;
        if (u2 + r2 > a2.byteLength) throw Ku(ju);
        for (var f2 = a2.bytes, l2 = u2 + a2.byteOffset, v2 = 0; v2 < r2; v2++) f2[l2 + v2] = s2[c2 ? v2 : r2 - v2 - 1];
      };
      if (hu) {
        var us = Cu && _u.name !== Lu;
        if (wu(function() {
          _u(1);
        }) && wu(function() {
          new _u(-1);
        }) && !wu(function() {
          return new _u(), new _u(1.5), new _u(NaN), 1 !== _u.length || us && !Uu;
        })) us && Uu && gu(_u, "name", Lu);
        else {
          (Vu = function(t2) {
            return bu(this, Wu), new _u(Au(t2));
          })[Du] = Wu;
          for (var ss, cs = Ou(_u), fs = 0; cs.length > fs; ) (ss = cs[fs++]) in Vu || gu(Vu, ss, _u[ss]);
          Wu.constructor = Vu;
        }
        Iu && Su(Yu) !== $u && Iu(Yu, $u);
        var ls = new Gu(new Vu(2)), vs = lu(Yu.setInt8);
        ls.setInt8(0, 2147483648), ls.setInt8(1, 2147483649), !ls.getInt8(0) && ls.getInt8(1) || yu(Yu, { setInt8: function(t2, r2) {
          vs(this, t2, r2 << 24 >> 24);
        }, setUint8: function(t2, r2) {
          vs(this, t2, r2 << 24 >> 24);
        } }, { unsafe: true });
      } else Wu = (Vu = function(t2) {
        bu(this, Wu);
        var r2 = Au(t2);
        Nu(this, { type: Lu, bytes: Hu(zu(r2), 0), byteLength: r2 }), vu || (this.byteLength = r2, this.detached = false);
      })[Du], Yu = (Gu = function(t2, r2, e2) {
        bu(this, Yu), bu(t2, Wu);
        var n2 = Bu(t2), i2 = n2.byteLength, o2 = mu(r2);
        if (o2 < 0 || o2 > i2) throw Ku("Wrong offset");
        if (o2 + (e2 = void 0 === e2 ? i2 - o2 : Eu(e2)) > i2) throw Ku("Wrong length");
        Nu(this, { type: Mu, buffer: t2, byteLength: e2, byteOffset: o2, bytes: n2.bytes }), vu || (this.buffer = t2, this.byteLength = e2, this.byteOffset = o2);
      })[Du], vu && (is(Vu, "byteLength", Bu), is(Gu, "buffer", Fu), is(Gu, "byteLength", Fu), is(Gu, "byteOffset", Fu)), yu(Yu, { getInt8: function(t2) {
        return os(this, 1, t2)[0] << 24 >> 24;
      }, getUint8: function(t2) {
        return os(this, 1, t2)[0];
      }, getInt16: function(t2) {
        var r2 = os(this, 2, t2, arguments.length > 1 && arguments[1]);
        return (r2[1] << 8 | r2[0]) << 16 >> 16;
      }, getUint16: function(t2) {
        var r2 = os(this, 2, t2, arguments.length > 1 && arguments[1]);
        return r2[1] << 8 | r2[0];
      }, getInt32: function(t2) {
        return rs(os(this, 4, t2, arguments.length > 1 && arguments[1]));
      }, getUint32: function(t2) {
        return rs(os(this, 4, t2, arguments.length > 1 && arguments[1])) >>> 0;
      }, getFloat32: function(t2) {
        return Zu(os(this, 4, t2, arguments.length > 1 && arguments[1]), 23);
      }, getFloat64: function(t2) {
        return Zu(os(this, 8, t2, arguments.length > 1 && arguments[1]), 52);
      }, setInt8: function(t2, r2) {
        as(this, 1, t2, qu, r2);
      }, setUint8: function(t2, r2) {
        as(this, 1, t2, qu, r2);
      }, setInt16: function(t2, r2) {
        as(this, 2, t2, Qu, r2, arguments.length > 2 && arguments[2]);
      }, setUint16: function(t2, r2) {
        as(this, 2, t2, Qu, r2, arguments.length > 2 && arguments[2]);
      }, setInt32: function(t2, r2) {
        as(this, 4, t2, ts, r2, arguments.length > 2 && arguments[2]);
      }, setUint32: function(t2, r2) {
        as(this, 4, t2, ts, r2, arguments.length > 2 && arguments[2]);
      }, setFloat32: function(t2, r2) {
        as(this, 4, t2, es, r2, arguments.length > 2 && arguments[2]);
      }, setFloat64: function(t2, r2) {
        as(this, 8, t2, ns, r2, arguments.length > 2 && arguments[2]);
      } });
      Pu(Vu, Lu), Pu(Gu, Mu);
      var hs = { ArrayBuffer: Vu, DataView: Gu }, ds = {};
      ds[wr("toStringTag")] = "z";
      var gs = "[object z]" === String(ds), ps = gs, ys = ot, ws = G, bs = wr("toStringTag"), ms = Object, Es = "Arguments" === ws(/* @__PURE__ */ function() {
        return arguments;
      }()), As = ps ? ws : function(t2) {
        var r2, e2, n2;
        return void 0 === t2 ? "Undefined" : null === t2 ? "Null" : "string" == typeof (e2 = function(t3, r3) {
          try {
            return t3[r3];
          } catch (t4) {
          }
        }(r2 = ms(t2), bs)) ? e2 : Es ? ws(r2) : "Object" === (n2 = ws(r2)) && ys(r2.callee) ? "Arguments" : n2;
      }, Ts = N, Ss = A, Is = ot, Os = As, xs = Se, ks = function() {
      }, Ps = [], Rs = lt("Reflect", "construct"), Cs = /^\s*(?:class|function)\b/, Us = Ts(Cs.exec), Ls = !Cs.exec(ks), Ms = function(t2) {
        if (!Is(t2)) return false;
        try {
          return Rs(ks, Ps, t2), true;
        } catch (t3) {
          return false;
        }
      }, Ds = function(t2) {
        if (!Is(t2)) return false;
        switch (Os(t2)) {
          case "AsyncFunction":
          case "GeneratorFunction":
          case "AsyncGeneratorFunction":
            return false;
        }
        try {
          return Ls || !!Us(Cs, xs(t2));
        } catch (t3) {
          return true;
        }
      };
      Ds.sham = true;
      var js = !Rs || Ss(function() {
        var t2;
        return Ms(Ms.call) || !Ms(Object) || !Ms(function() {
          t2 = true;
        }) || t2;
      }) ? Ds : Ms, Bs = js, Fs = Ut, Ns = TypeError, _s = function(t2) {
        if (Bs(t2)) return t2;
        throw Ns(Fs(t2) + " is not a constructor");
      }, Vs = Jr, Ws = _s, Gs = X, Ys = wr("species"), $s = function(t2, r2) {
        var e2, n2 = Vs(t2).constructor;
        return void 0 === n2 || Gs(e2 = Vs(n2)[Ys]) ? r2 : Ws(e2);
      }, zs = bi, Ks = xa, Hs = A, Xs = Jr, Js = In, Zs = kn, qs = $s, Qs = hs.ArrayBuffer, tc = hs.DataView, rc = tc.prototype, ec = Ks(Qs.prototype.slice), nc = Ks(rc.getUint8), ic = Ks(rc.setUint8);
      zs({ target: "ArrayBuffer", proto: true, unsafe: true, forced: Hs(function() {
        return !new Qs(2).slice(1, void 0).byteLength;
      }) }, { slice: function(t2, r2) {
        if (ec && void 0 === r2) return ec(Xs(this), t2);
        for (var e2 = Xs(this).byteLength, n2 = Js(t2, e2), i2 = Js(void 0 === r2 ? e2 : r2, e2), o2 = new (qs(this, Qs))(Zs(i2 - n2)), a2 = new tc(this), u2 = new tc(o2), s2 = 0; n2 < i2; ) ic(u2, s2++, nc(a2, n2++));
        return o2;
      } });
      var oc = As, ac = gs ? {}.toString : function() {
        return "[object " + oc(this) + "]";
      };
      gs || gn(Object.prototype, "toString", ac, { unsafe: true });
      var uc = { exports: {} }, sc = wr("iterator"), cc = false;
      try {
        var fc = 0, lc = { next: function() {
          return { done: !!fc++ };
        }, return: function() {
          cc = true;
        } };
        lc[sc] = function() {
          return this;
        }, Array.from(lc, function() {
          throw 2;
        });
      } catch (t2) {
      }
      var vc, hc, dc, gc = function(t2, r2) {
        try {
          if (!r2 && !cc) return false;
        } catch (t3) {
          return false;
        }
        var e2 = false;
        try {
          var n2 = {};
          n2[sc] = function() {
            return { next: function() {
              return { done: e2 = true };
            } };
          }, t2(n2);
        } catch (t3) {
        }
        return e2;
      }, pc = ka, yc = T, wc = m, bc = ot, mc = st, Ec = ir, Ac = As, Tc = Ut, Sc = fe, Ic = gn, Oc = Ca, xc = vt, kc = po, Pc = Yo, Rc = wr, Cc = cr, Uc = $e.enforce, Lc = $e.get, Mc = wc.Int8Array, Dc = Mc && Mc.prototype, jc = wc.Uint8ClampedArray, Bc = jc && jc.prototype, Fc = Mc && kc(Mc), Nc = Dc && kc(Dc), _c = Object.prototype, Vc = wc.TypeError, Wc = Rc("toStringTag"), Gc = Cc("TYPED_ARRAY_TAG"), Yc = "TypedArrayConstructor", $c = pc && !!Pc && "Opera" !== Ac(wc.opera), zc = false, Kc = { Int8Array: 1, Uint8Array: 1, Uint8ClampedArray: 1, Int16Array: 2, Uint16Array: 2, Int32Array: 4, Uint32Array: 4, Float32Array: 4, Float64Array: 8 }, Hc = { BigInt64Array: 8, BigUint64Array: 8 }, Xc = function(t2) {
        var r2 = kc(t2);
        if (mc(r2)) {
          var e2 = Lc(r2);
          return e2 && Ec(e2, Yc) ? e2[Yc] : Xc(r2);
        }
      }, Jc = function(t2) {
        if (!mc(t2)) return false;
        var r2 = Ac(t2);
        return Ec(Kc, r2) || Ec(Hc, r2);
      };
      for (vc in Kc) (dc = (hc = wc[vc]) && hc.prototype) ? Uc(dc)[Yc] = hc : $c = false;
      for (vc in Hc) (dc = (hc = wc[vc]) && hc.prototype) && (Uc(dc)[Yc] = hc);
      if ((!$c || !bc(Fc) || Fc === Function.prototype) && (Fc = function() {
        throw Vc("Incorrect invocation");
      }, $c)) for (vc in Kc) wc[vc] && Pc(wc[vc], Fc);
      if ((!$c || !Nc || Nc === _c) && (Nc = Fc.prototype, $c)) for (vc in Kc) wc[vc] && Pc(wc[vc].prototype, Nc);
      if ($c && kc(Bc) !== Nc && Pc(Bc, Nc), yc && !Ec(Nc, Wc)) for (vc in zc = true, Oc(Nc, Wc, { configurable: true, get: function() {
        return mc(this) ? this[Gc] : void 0;
      } }), Kc) wc[vc] && Sc(wc[vc], Gc, vc);
      var Zc = { NATIVE_ARRAY_BUFFER_VIEWS: $c, TYPED_ARRAY_TAG: zc && Gc, aTypedArray: function(t2) {
        if (Jc(t2)) return t2;
        throw Vc("Target is not a typed array");
      }, aTypedArrayConstructor: function(t2) {
        if (bc(t2) && (!Pc || xc(Fc, t2))) return t2;
        throw Vc(Tc(t2) + " is not a typed array constructor");
      }, exportTypedArrayMethod: function(t2, r2, e2, n2) {
        if (yc) {
          if (e2) for (var i2 in Kc) {
            var o2 = wc[i2];
            if (o2 && Ec(o2.prototype, t2)) try {
              delete o2.prototype[t2];
            } catch (e3) {
              try {
                o2.prototype[t2] = r2;
              } catch (t3) {
              }
            }
          }
          Nc[t2] && !e2 || Ic(Nc, t2, e2 ? r2 : $c && Dc[t2] || r2, n2);
        }
      }, exportTypedArrayStaticMethod: function(t2, r2, e2) {
        var n2, i2;
        if (yc) {
          if (Pc) {
            if (e2) {
              for (n2 in Kc) if ((i2 = wc[n2]) && Ec(i2, t2)) try {
                delete i2[t2];
              } catch (t3) {
              }
            }
            if (Fc[t2] && !e2) return;
            try {
              return Ic(Fc, t2, e2 ? r2 : $c && Fc[t2] || r2);
            } catch (t3) {
            }
          }
          for (n2 in Kc) !(i2 = wc[n2]) || i2[t2] && !e2 || Ic(i2, t2, r2);
        }
      }, getTypedArrayConstructor: Xc, isView: function(t2) {
        if (!mc(t2)) return false;
        var r2 = Ac(t2);
        return "DataView" === r2 || Ec(Kc, r2) || Ec(Hc, r2);
      }, isTypedArray: Jc, TypedArray: Fc, TypedArrayPrototype: Nc }, qc = m, Qc = A, tf = gc, rf = Zc.NATIVE_ARRAY_BUFFER_VIEWS, ef = qc.ArrayBuffer, nf = qc.Int8Array, of = !rf || !Qc(function() {
        nf(1);
      }) || !Qc(function() {
        new nf(-1);
      }) || !tf(function(t2) {
        new nf(), new nf(null), new nf(1.5), new nf(t2);
      }, true) || Qc(function() {
        return 1 !== new nf(new ef(2), 1, void 0).length;
      }), af = st, uf = Math.floor, sf = Number.isInteger || function(t2) {
        return !af(t2) && isFinite(t2) && uf(t2) === t2;
      }, cf = En, ff = RangeError, lf = function(t2) {
        var r2 = cf(t2);
        if (r2 < 0) throw ff("The argument can't be less than 0");
        return r2;
      }, vf = RangeError, hf = function(t2, r2) {
        var e2 = lf(t2);
        if (e2 % r2) throw vf("Wrong offset");
        return e2;
      }, df = Math.round, gf = jt, pf = S, yf = xa(xa.bind), wf = function(t2, r2) {
        return gf(t2), void 0 === r2 ? t2 : pf ? yf(t2, r2) : function() {
          return t2.apply(r2, arguments);
        };
      }, bf = As, mf = Nt, Ef = X, Af = ao, Tf = wr("iterator"), Sf = function(t2) {
        if (!Ef(t2)) return mf(t2, Tf) || mf(t2, "@@iterator") || Af[bf(t2)];
      }, If = x, Of = jt, xf = Jr, kf = Ut, Pf = Sf, Rf = TypeError, Cf = function(t2, r2) {
        var e2 = arguments.length < 2 ? Pf(t2) : r2;
        if (Of(e2)) return xf(If(e2, t2));
        throw Rf(kf(t2) + " is not iterable");
      }, Uf = ao, Lf = wr("iterator"), Mf = Array.prototype, Df = function(t2) {
        return void 0 !== t2 && (Uf.Array === t2 || Mf[Lf] === t2);
      }, jf = As, Bf = Or, Ff = TypeError, Nf = function(t2) {
        var r2 = Bf(t2, "number");
        if ("number" == typeof r2) throw Ff("Can't convert number to bigint");
        return BigInt(r2);
      }, _f = wf, Vf = x, Wf = _s, Gf = rr, Yf = Rn, $f = Cf, zf = Sf, Kf = Df, Hf = function(t2) {
        var r2 = jf(t2);
        return "BigInt64Array" === r2 || "BigUint64Array" === r2;
      }, Xf = Zc.aTypedArrayConstructor, Jf = Nf, Zf = Mi, qf = js, Qf = st, tl = wr("species"), rl = Array, el = function(t2) {
        var r2;
        return Zf(t2) && (r2 = t2.constructor, (qf(r2) && (r2 === rl || Zf(r2.prototype)) || Qf(r2) && null === (r2 = r2[tl])) && (r2 = void 0)), void 0 === r2 ? rl : r2;
      }, nl = function(t2, r2) {
        return new (el(t2))(0 === r2 ? 0 : r2);
      }, il = wf, ol = H, al = rr, ul = Rn, sl = nl, cl = N([].push), fl = function(t2) {
        var r2 = 1 === t2, e2 = 2 === t2, n2 = 3 === t2, i2 = 4 === t2, o2 = 6 === t2, a2 = 7 === t2, u2 = 5 === t2 || o2;
        return function(s2, c2, f2, l2) {
          for (var v2, h2, d2 = al(s2), g2 = ol(d2), p2 = il(c2, f2), y2 = ul(g2), w2 = 0, b2 = l2 || sl, m2 = r2 ? b2(s2, y2) : e2 || a2 ? b2(s2, 0) : void 0; y2 > w2; w2++) if ((u2 || w2 in g2) && (h2 = p2(v2 = g2[w2], w2, d2), t2)) if (r2) m2[w2] = h2;
          else if (h2) switch (t2) {
            case 3:
              return true;
            case 5:
              return v2;
            case 6:
              return w2;
            case 2:
              cl(m2, v2);
          }
          else switch (t2) {
            case 4:
              return false;
            case 7:
              cl(m2, v2);
          }
          return o2 ? -1 : n2 || i2 ? i2 : m2;
        };
      }, ll = { forEach: fl(0), map: fl(1), filter: fl(2), some: fl(3), every: fl(4), find: fl(5), findIndex: fl(6), filterReject: fl(7) }, vl = lt, hl = Ca, dl = T, gl = wr("species"), pl = function(t2) {
        var r2 = vl(t2);
        dl && r2 && !r2[gl] && hl(r2, gl, { configurable: true, get: function() {
          return this;
        } });
      }, yl = ot, wl = st, bl = Yo, ml = function(t2, r2, e2) {
        var n2, i2;
        return bl && yl(n2 = r2.constructor) && n2 !== e2 && wl(i2 = n2.prototype) && i2 !== e2.prototype && bl(t2, i2), t2;
      }, El = bi, Al = m, Tl = x, Sl = T, Il = of, Ol = Zc, xl = hs, kl = Da, Pl = M, Rl = fe, Cl = sf, Ul = kn, Ll = Na, Ml = hf, Dl = function(t2) {
        var r2 = df(t2);
        return r2 < 0 ? 0 : r2 > 255 ? 255 : 255 & r2;
      }, jl = Pr, Bl = ir, Fl = As, Nl = st, _l = Rt, Vl = Ji, Wl = vt, Gl = Yo, Yl = pn.f, $l = function(t2) {
        var r2, e2, n2, i2, o2, a2, u2, s2, c2 = Wf(this), f2 = Gf(t2), l2 = arguments.length, v2 = l2 > 1 ? arguments[1] : void 0, h2 = void 0 !== v2, d2 = zf(f2);
        if (d2 && !Kf(d2)) for (s2 = (u2 = $f(f2, d2)).next, f2 = []; !(a2 = Vf(s2, u2)).done; ) f2.push(a2.value);
        for (h2 && l2 > 2 && (v2 = _f(v2, arguments[2])), e2 = Yf(f2), n2 = new (Xf(c2))(e2), i2 = Hf(n2), r2 = 0; e2 > r2; r2++) o2 = h2 ? v2(f2[r2], r2) : f2[r2], n2[r2] = i2 ? Jf(o2) : +o2;
        return n2;
      }, zl = ll.forEach, Kl = pl, Hl = Ca, Xl = $r, Jl = E, Zl = ml, ql = $e.get, Ql = $e.set, tv = $e.enforce, rv = Xl.f, ev = Jl.f, nv = Al.RangeError, iv = xl.ArrayBuffer, ov = iv.prototype, av = xl.DataView, uv = Ol.NATIVE_ARRAY_BUFFER_VIEWS, sv = Ol.TYPED_ARRAY_TAG, cv = Ol.TypedArray, fv = Ol.TypedArrayPrototype, lv = Ol.aTypedArrayConstructor, vv = Ol.isTypedArray, hv = "BYTES_PER_ELEMENT", dv = "Wrong length", gv = function(t2, r2) {
        lv(t2);
        for (var e2 = 0, n2 = r2.length, i2 = new t2(n2); n2 > e2; ) i2[e2] = r2[e2++];
        return i2;
      }, pv = function(t2, r2) {
        Hl(t2, r2, { configurable: true, get: function() {
          return ql(this)[r2];
        } });
      }, yv = function(t2) {
        var r2;
        return Wl(ov, t2) || "ArrayBuffer" === (r2 = Fl(t2)) || "SharedArrayBuffer" === r2;
      }, wv = function(t2, r2) {
        return vv(t2) && !_l(r2) && r2 in t2 && Cl(+r2) && r2 >= 0;
      }, bv = function(t2, r2) {
        return r2 = jl(r2), wv(t2, r2) ? Pl(2, t2[r2]) : ev(t2, r2);
      }, mv = function(t2, r2, e2) {
        return r2 = jl(r2), !(wv(t2, r2) && Nl(e2) && Bl(e2, "value")) || Bl(e2, "get") || Bl(e2, "set") || e2.configurable || Bl(e2, "writable") && !e2.writable || Bl(e2, "enumerable") && !e2.enumerable ? rv(t2, r2, e2) : (t2[r2] = e2.value, t2);
      };
      Sl ? (uv || (Jl.f = bv, Xl.f = mv, pv(fv, "buffer"), pv(fv, "byteOffset"), pv(fv, "byteLength"), pv(fv, "length")), El({ target: "Object", stat: true, forced: !uv }, { getOwnPropertyDescriptor: bv, defineProperty: mv }), uc.exports = function(t2, r2, e2) {
        var n2 = t2.match(/\d+/)[0] / 8, i2 = t2 + (e2 ? "Clamped" : "") + "Array", o2 = "get" + t2, a2 = "set" + t2, u2 = Al[i2], s2 = u2, c2 = s2 && s2.prototype, f2 = {}, l2 = function(t3, r3) {
          rv(t3, r3, { get: function() {
            return function(t4, r4) {
              var e3 = ql(t4);
              return e3.view[o2](r4 * n2 + e3.byteOffset, true);
            }(this, r3);
          }, set: function(t4) {
            return function(t5, r4, i3) {
              var o3 = ql(t5);
              o3.view[a2](r4 * n2 + o3.byteOffset, e2 ? Dl(i3) : i3, true);
            }(this, r3, t4);
          }, enumerable: true });
        };
        uv ? Il && (s2 = r2(function(t3, r3, e3, i3) {
          return kl(t3, c2), Zl(Nl(r3) ? yv(r3) ? void 0 !== i3 ? new u2(r3, Ml(e3, n2), i3) : void 0 !== e3 ? new u2(r3, Ml(e3, n2)) : new u2(r3) : vv(r3) ? gv(s2, r3) : Tl($l, s2, r3) : new u2(Ll(r3)), t3, s2);
        }), Gl && Gl(s2, cv), zl(Yl(u2), function(t3) {
          t3 in s2 || Rl(s2, t3, u2[t3]);
        }), s2.prototype = c2) : (s2 = r2(function(t3, r3, e3, i3) {
          kl(t3, c2);
          var o3, a3, u3, f3 = 0, v3 = 0;
          if (Nl(r3)) {
            if (!yv(r3)) return vv(r3) ? gv(s2, r3) : Tl($l, s2, r3);
            o3 = r3, v3 = Ml(e3, n2);
            var h2 = r3.byteLength;
            if (void 0 === i3) {
              if (h2 % n2) throw nv(dv);
              if ((a3 = h2 - v3) < 0) throw nv(dv);
            } else if ((a3 = Ul(i3) * n2) + v3 > h2) throw nv(dv);
            u3 = a3 / n2;
          } else u3 = Ll(r3), o3 = new iv(a3 = u3 * n2);
          for (Ql(t3, { buffer: o3, byteOffset: v3, byteLength: a3, length: u3, view: new av(o3) }); f3 < u3; ) l2(t3, f3++);
        }), Gl && Gl(s2, cv), c2 = s2.prototype = Vl(fv)), c2.constructor !== s2 && Rl(c2, "constructor", s2), tv(c2).TypedArrayConstructor = s2, sv && Rl(c2, sv, i2);
        var v2 = s2 !== u2;
        f2[i2] = s2, El({ global: true, constructor: true, forced: v2, sham: !uv }, f2), hv in s2 || Rl(s2, hv, n2), hv in c2 || Rl(c2, hv, n2), Kl(i2);
      }) : uc.exports = function() {
      };
      var Ev = uc.exports;
      Ev("Uint8", function(t2) {
        return function(r2, e2, n2) {
          return t2(this, r2, e2, n2);
        };
      });
      var Av = Ut, Tv = TypeError, Sv = rr, Iv = In, Ov = Rn, xv = function(t2, r2) {
        if (!delete t2[r2]) throw Tv("Cannot delete property " + Av(r2) + " of " + Av(t2));
      }, kv = Math.min, Pv = [].copyWithin || function(t2, r2) {
        var e2 = Sv(this), n2 = Ov(e2), i2 = Iv(t2, n2), o2 = Iv(r2, n2), a2 = arguments.length > 2 ? arguments[2] : void 0, u2 = kv((void 0 === a2 ? n2 : Iv(a2, n2)) - o2, n2 - i2), s2 = 1;
        for (o2 < i2 && i2 < o2 + u2 && (s2 = -1, o2 += u2 - 1, i2 += u2 - 1); u2-- > 0; ) o2 in e2 ? e2[i2] = e2[o2] : xv(e2, i2), i2 += s2, o2 += s2;
        return e2;
      }, Rv = Zc, Cv = N(Pv), Uv = Rv.aTypedArray;
      (0, Rv.exportTypedArrayMethod)("copyWithin", function(t2, r2) {
        return Cv(Uv(this), t2, r2, arguments.length > 2 ? arguments[2] : void 0);
      });
      var Lv = ll.every, Mv = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("every", function(t2) {
        return Lv(Mv(this), t2, arguments.length > 1 ? arguments[1] : void 0);
      });
      var Dv = Qa, jv = Nf, Bv = As, Fv = x, Nv = A, _v = Zc.aTypedArray, Vv = Zc.exportTypedArrayMethod, Wv = N("".slice);
      Vv("fill", function(t2) {
        var r2 = arguments.length;
        _v(this);
        var e2 = "Big" === Wv(Bv(this), 0, 3) ? jv(t2) : +t2;
        return Fv(Dv, this, e2, r2 > 1 ? arguments[1] : void 0, r2 > 2 ? arguments[2] : void 0);
      }, Nv(function() {
        var t2 = 0;
        return new Int8Array(2).fill({ valueOf: function() {
          return t2++;
        } }), 1 !== t2;
      }));
      var Gv = Rn, Yv = $s, $v = Zc.aTypedArrayConstructor, zv = Zc.getTypedArrayConstructor, Kv = function(t2) {
        return $v(Yv(t2, zv(t2)));
      }, Hv = function(t2, r2) {
        for (var e2 = 0, n2 = Gv(r2), i2 = new t2(n2); n2 > e2; ) i2[e2] = r2[e2++];
        return i2;
      }, Xv = Kv, Jv = ll.filter, Zv = function(t2, r2) {
        return Hv(Xv(t2), r2);
      }, qv = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("filter", function(t2) {
        var r2 = Jv(qv(this), t2, arguments.length > 1 ? arguments[1] : void 0);
        return Zv(this, r2);
      });
      var Qv = ll.find, th = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("find", function(t2) {
        return Qv(th(this), t2, arguments.length > 1 ? arguments[1] : void 0);
      });
      var rh = ll.findIndex, eh = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("findIndex", function(t2) {
        return rh(eh(this), t2, arguments.length > 1 ? arguments[1] : void 0);
      });
      var nh = ll.forEach, ih = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("forEach", function(t2) {
        nh(ih(this), t2, arguments.length > 1 ? arguments[1] : void 0);
      });
      var oh = Dn.includes, ah = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("includes", function(t2) {
        return oh(ah(this), t2, arguments.length > 1 ? arguments[1] : void 0);
      });
      var uh = Dn.indexOf, sh = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("indexOf", function(t2) {
        return uh(sh(this), t2, arguments.length > 1 ? arguments[1] : void 0);
      });
      var ch = m, fh = A, lh = N, vh = Zc, hh = Ta, dh = wr("iterator"), gh = ch.Uint8Array, ph = lh(hh.values), yh = lh(hh.keys), wh = lh(hh.entries), bh = vh.aTypedArray, mh = vh.exportTypedArrayMethod, Eh = gh && gh.prototype, Ah = !fh(function() {
        Eh[dh].call([1]);
      }), Th = !!Eh && Eh.values && Eh[dh] === Eh.values && "values" === Eh.values.name, Sh = function() {
        return ph(bh(this));
      };
      mh("entries", function() {
        return wh(bh(this));
      }, Ah), mh("keys", function() {
        return yh(bh(this));
      }, Ah), mh("values", Sh, Ah || !Th, { name: "values" }), mh(dh, Sh, Ah || !Th, { name: "values" });
      var Ih = Zc.aTypedArray, Oh = Zc.exportTypedArrayMethod, xh = N([].join);
      Oh("join", function(t2) {
        return xh(Ih(this), t2);
      });
      var kh = S, Ph = Function.prototype, Rh = Ph.apply, Ch = Ph.call, Uh = "object" == typeof Reflect && Reflect.apply || (kh ? Ch.bind(Rh) : function() {
        return Ch.apply(Rh, arguments);
      }), Lh = A, Mh = function(t2, r2) {
        var e2 = [][t2];
        return !!e2 && Lh(function() {
          e2.call(null, r2 || function() {
            return 1;
          }, 1);
        });
      }, Dh = Uh, jh = rt, Bh = En, Fh = Rn, Nh = Mh, _h = Math.min, Vh = [].lastIndexOf, Wh = !!Vh && 1 / [1].lastIndexOf(1, -0) < 0, Gh = Nh("lastIndexOf"), Yh = Wh || !Gh ? function(t2) {
        if (Wh) return Dh(Vh, this, arguments) || 0;
        var r2 = jh(this), e2 = Fh(r2), n2 = e2 - 1;
        for (arguments.length > 1 && (n2 = _h(n2, Bh(arguments[1]))), n2 < 0 && (n2 = e2 + n2); n2 >= 0; n2--) if (n2 in r2 && r2[n2] === t2) return n2 || 0;
        return -1;
      } : Vh, $h = Uh, zh = Yh, Kh = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("lastIndexOf", function(t2) {
        var r2 = arguments.length;
        return $h(zh, Kh(this), r2 > 1 ? [t2, arguments[1]] : [t2]);
      });
      var Hh = ll.map, Xh = Kv, Jh = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("map", function(t2) {
        return Hh(Jh(this), t2, arguments.length > 1 ? arguments[1] : void 0, function(t3, r2) {
          return new (Xh(t3))(r2);
        });
      });
      var Zh = jt, qh = rr, Qh = H, td = Rn, rd = TypeError, ed = function(t2) {
        return function(r2, e2, n2, i2) {
          Zh(e2);
          var o2 = qh(r2), a2 = Qh(o2), u2 = td(o2), s2 = t2 ? u2 - 1 : 0, c2 = t2 ? -1 : 1;
          if (n2 < 2) for (; ; ) {
            if (s2 in a2) {
              i2 = a2[s2], s2 += c2;
              break;
            }
            if (s2 += c2, t2 ? s2 < 0 : u2 <= s2) throw rd("Reduce of empty array with no initial value");
          }
          for (; t2 ? s2 >= 0 : u2 > s2; s2 += c2) s2 in a2 && (i2 = e2(i2, a2[s2], s2, o2));
          return i2;
        };
      }, nd = { left: ed(false), right: ed(true) }, id = nd.left, od = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("reduce", function(t2) {
        var r2 = arguments.length;
        return id(od(this), t2, r2, r2 > 1 ? arguments[1] : void 0);
      });
      var ad = nd.right, ud = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("reduceRight", function(t2) {
        var r2 = arguments.length;
        return ad(ud(this), t2, r2, r2 > 1 ? arguments[1] : void 0);
      });
      var sd = Zc.aTypedArray, cd = Zc.exportTypedArrayMethod, fd = Math.floor;
      cd("reverse", function() {
        for (var t2, r2 = this, e2 = sd(r2).length, n2 = fd(e2 / 2), i2 = 0; i2 < n2; ) t2 = r2[i2], r2[i2++] = r2[--e2], r2[e2] = t2;
        return r2;
      });
      var ld = m, vd = x, hd = Zc, dd = Rn, gd = hf, pd = rr, yd = A, wd = ld.RangeError, bd = ld.Int8Array, md = bd && bd.prototype, Ed = md && md.set, Ad = hd.aTypedArray, Td = hd.exportTypedArrayMethod, Sd = !yd(function() {
        var t2 = new Uint8ClampedArray(2);
        return vd(Ed, t2, { length: 1, 0: 3 }, 1), 3 !== t2[1];
      }), Id = Sd && hd.NATIVE_ARRAY_BUFFER_VIEWS && yd(function() {
        var t2 = new bd(2);
        return t2.set(1), t2.set("2", 1), 0 !== t2[0] || 2 !== t2[1];
      });
      Td("set", function(t2) {
        Ad(this);
        var r2 = gd(arguments.length > 1 ? arguments[1] : void 0, 1), e2 = pd(t2);
        if (Sd) return vd(Ed, this, e2, r2);
        var n2 = this.length, i2 = dd(e2), o2 = 0;
        if (i2 + r2 > n2) throw wd("Wrong length");
        for (; o2 < i2; ) this[r2 + o2] = e2[o2++];
      }, !Sd || Id);
      var Od = N([].slice), xd = Kv, kd = Od, Pd = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("slice", function(t2, r2) {
        for (var e2 = kd(Pd(this), t2, r2), n2 = xd(this), i2 = 0, o2 = e2.length, a2 = new n2(o2); o2 > i2; ) a2[i2] = e2[i2++];
        return a2;
      }, A(function() {
        new Int8Array(1).slice();
      }));
      var Rd = ll.some, Cd = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("some", function(t2) {
        return Rd(Cd(this), t2, arguments.length > 1 ? arguments[1] : void 0);
      });
      var Ud = cu, Ld = Math.floor, Md = function(t2, r2) {
        var e2 = t2.length, n2 = Ld(e2 / 2);
        return e2 < 8 ? Dd(t2, r2) : jd(t2, Md(Ud(t2, 0, n2), r2), Md(Ud(t2, n2), r2), r2);
      }, Dd = function(t2, r2) {
        for (var e2, n2, i2 = t2.length, o2 = 1; o2 < i2; ) {
          for (n2 = o2, e2 = t2[o2]; n2 && r2(t2[n2 - 1], e2) > 0; ) t2[n2] = t2[--n2];
          n2 !== o2++ && (t2[n2] = e2);
        }
        return t2;
      }, jd = function(t2, r2, e2, n2) {
        for (var i2 = r2.length, o2 = e2.length, a2 = 0, u2 = 0; a2 < i2 || u2 < o2; ) t2[a2 + u2] = a2 < i2 && u2 < o2 ? n2(r2[a2], e2[u2]) <= 0 ? r2[a2++] : e2[u2++] : a2 < i2 ? r2[a2++] : e2[u2++];
        return t2;
      }, Bd = Md, Fd = ht.match(/firefox\/(\d+)/i), Nd = !!Fd && +Fd[1], _d = /MSIE|Trident/.test(ht), Vd = ht.match(/AppleWebKit\/(\d+)\./), Wd = !!Vd && +Vd[1], Gd = xa, Yd = A, $d = jt, zd = Bd, Kd = Nd, Hd = _d, Xd = mt, Jd = Wd, Zd = Zc.aTypedArray, qd = Zc.exportTypedArrayMethod, Qd = m.Uint16Array, tg = Qd && Gd(Qd.prototype.sort), rg = !(!tg || Yd(function() {
        tg(new Qd(2), null);
      }) && Yd(function() {
        tg(new Qd(2), {});
      })), eg = !!tg && !Yd(function() {
        if (Xd) return Xd < 74;
        if (Kd) return Kd < 67;
        if (Hd) return true;
        if (Jd) return Jd < 602;
        var t2, r2, e2 = new Qd(516), n2 = Array(516);
        for (t2 = 0; t2 < 516; t2++) r2 = t2 % 4, e2[t2] = 515 - t2, n2[t2] = t2 - 2 * r2 + 3;
        for (tg(e2, function(t3, r3) {
          return (t3 / 4 | 0) - (r3 / 4 | 0);
        }), t2 = 0; t2 < 516; t2++) if (e2[t2] !== n2[t2]) return true;
      });
      qd("sort", function(t2) {
        return void 0 !== t2 && $d(t2), eg ? tg(this, t2) : zd(Zd(this), /* @__PURE__ */ function(t3) {
          return function(r2, e2) {
            return void 0 !== t3 ? +t3(r2, e2) || 0 : e2 != e2 ? -1 : r2 != r2 ? 1 : 0 === r2 && 0 === e2 ? 1 / r2 > 0 && 1 / e2 < 0 ? 1 : -1 : r2 > e2;
          };
        }(t2));
      }, !eg || rg);
      var ng = kn, ig = In, og = Kv, ag = Zc.aTypedArray;
      (0, Zc.exportTypedArrayMethod)("subarray", function(t2, r2) {
        var e2 = ag(this), n2 = e2.length, i2 = ig(t2, n2);
        return new (og(e2))(e2.buffer, e2.byteOffset + i2 * e2.BYTES_PER_ELEMENT, ng((void 0 === r2 ? n2 : ig(r2, n2)) - i2));
      });
      var ug = Uh, sg = Zc, cg = A, fg = Od, lg = m.Int8Array, vg = sg.aTypedArray, hg = sg.exportTypedArrayMethod, dg = [].toLocaleString, gg = !!lg && cg(function() {
        dg.call(new lg(1));
      });
      hg("toLocaleString", function() {
        return ug(dg, gg ? fg(vg(this)) : vg(this), fg(arguments));
      }, cg(function() {
        return [1, 2].toLocaleString() !== new lg([1, 2]).toLocaleString();
      }) || !cg(function() {
        lg.prototype.toLocaleString.call([1, 2]);
      }));
      var pg = Zc.exportTypedArrayMethod, yg = A, wg = N, bg = m.Uint8Array, mg = bg && bg.prototype || {}, Eg = [].toString, Ag = wg([].join);
      yg(function() {
        Eg.call({});
      }) && (Eg = function() {
        return Ag(this);
      });
      var Tg = mg.toString !== Eg;
      pg("toString", Eg, Tg);
      var Sg = A, Ig = mt, Og = wr("species"), xg = function(t2) {
        return Ig >= 51 || !Sg(function() {
          var r2 = [];
          return (r2.constructor = {})[Og] = function() {
            return { foo: 1 };
          }, 1 !== r2[t2](Boolean).foo;
        });
      }, kg = bi, Pg = Mi, Rg = js, Cg = st, Ug = In, Lg = Rn, Mg = rt, Dg = nu, jg = wr, Bg = Od, Fg = xg("slice"), Ng = jg("species"), _g = Array, Vg = Math.max;
      kg({ target: "Array", proto: true, forced: !Fg }, { slice: function(t2, r2) {
        var e2, n2, i2, o2 = Mg(this), a2 = Lg(o2), u2 = Ug(t2, a2), s2 = Ug(void 0 === r2 ? a2 : r2, a2);
        if (Pg(o2) && (e2 = o2.constructor, (Rg(e2) && (e2 === _g || Pg(e2.prototype)) || Cg(e2) && null === (e2 = e2[Ng])) && (e2 = void 0), e2 === _g || void 0 === e2)) return Bg(o2, u2, s2);
        for (n2 = new (void 0 === e2 ? _g : e2)(Vg(s2 - u2, 0)), i2 = 0; u2 < s2; u2++, i2++) u2 in o2 && Dg(n2, i2, o2[u2]);
        return n2.length = i2, n2;
      } });
      var Wg = pl, Gg = "ArrayBuffer", Yg = hs[Gg];
      bi({ global: true, constructor: true, forced: m[Gg] !== Yg }, { ArrayBuffer: Yg }), Wg(Gg);
      bi({ target: "ArrayBuffer", stat: true, forced: !Zc.NATIVE_ARRAY_BUFFER_VIEWS }, { isView: Zc.isView });
      var $g = TypeError, zg = function(t2) {
        if (t2 > 9007199254740991) throw $g("Maximum allowed index exceeded");
        return t2;
      }, Kg = bi, Hg = A, Xg = Mi, Jg = st, Zg = rr, qg = Rn, Qg = zg, tp = nu, rp = nl, ep = xg, np = mt, ip = wr("isConcatSpreadable"), op = np >= 51 || !Hg(function() {
        var t2 = [];
        return t2[ip] = false, t2.concat()[0] !== t2;
      }), ap = function(t2) {
        if (!Jg(t2)) return false;
        var r2 = t2[ip];
        return void 0 !== r2 ? !!r2 : Xg(t2);
      };
      Kg({ target: "Array", proto: true, arity: 1, forced: !op || !ep("concat") }, { concat: function(t2) {
        var r2, e2, n2, i2, o2, a2 = Zg(this), u2 = rp(a2, 0), s2 = 0;
        for (r2 = -1, n2 = arguments.length; r2 < n2; r2++) if (ap(o2 = -1 === r2 ? a2 : arguments[r2])) for (i2 = qg(o2), Qg(s2 + i2), e2 = 0; e2 < i2; e2++, s2++) e2 in o2 && tp(u2, s2, o2[e2]);
        else Qg(s2 + 1), tp(u2, s2++, o2);
        return u2.length = s2, u2;
      } });
      var up, sp = As, cp = String, fp = function(t2) {
        if ("Symbol" === sp(t2)) throw TypeError("Cannot convert a Symbol value to a string");
        return cp(t2);
      }, lp = st, vp = G, hp = wr("match"), dp = function(t2) {
        var r2;
        return lp(t2) && (void 0 !== (r2 = t2[hp]) ? !!r2 : "RegExp" === vp(t2));
      }, gp = dp, pp = TypeError, yp = function(t2) {
        if (gp(t2)) throw pp("The method doesn't accept regular expressions");
        return t2;
      }, wp = wr("match"), bp = function(t2) {
        var r2 = /./;
        try {
          "/./"[t2](r2);
        } catch (e2) {
          try {
            return r2[wp] = false, "/./"[t2](r2);
          } catch (t3) {
          }
        }
        return false;
      }, mp = bi, Ep = xa, Ap = E.f, Tp = kn, Sp = fp, Ip = yp, Op = q, xp = bp, kp = Ep("".endsWith), Pp = Ep("".slice), Rp = Math.min, Cp = xp("endsWith");
      mp({ target: "String", proto: true, forced: !!(Cp || (up = Ap(String.prototype, "endsWith"), !up || up.writable)) && !Cp }, { endsWith: function(t2) {
        var r2 = Sp(Op(this));
        Ip(t2);
        var e2 = arguments.length > 1 ? arguments[1] : void 0, n2 = r2.length, i2 = void 0 === e2 ? n2 : Rp(Tp(e2), n2), o2 = Sp(t2);
        return kp ? kp(r2, o2, i2) : Pp(r2, i2 - o2.length, i2) === o2;
      } }), bi({ global: true, constructor: true, forced: !ka }, { DataView: hs.DataView }), Ev("Uint16", function(t2) {
        return function(r2, e2, n2) {
          return t2(this, r2, e2, n2);
        };
      });
      var Up = ll.forEach, Lp = Mh("forEach") ? [].forEach : function(t2) {
        return Up(this, t2, arguments.length > 1 ? arguments[1] : void 0);
      };
      bi({ target: "Array", proto: true, forced: [].forEach !== Lp }, { forEach: Lp });
      var Mp = Lr("span").classList, Dp = Mp && Mp.constructor && Mp.constructor.prototype, jp = m, Bp = { CSSRuleList: 0, CSSStyleDeclaration: 0, CSSValueList: 0, ClientRectList: 0, DOMRectList: 0, DOMStringList: 0, DOMTokenList: 1, DataTransferItemList: 0, FileList: 0, HTMLAllCollection: 0, HTMLCollection: 0, HTMLFormElement: 0, HTMLSelectElement: 0, MediaList: 0, MimeTypeArray: 0, NamedNodeMap: 0, NodeList: 1, PaintRequestList: 0, Plugin: 0, PluginArray: 0, SVGLengthList: 0, SVGNumberList: 0, SVGPathSegList: 0, SVGPointList: 0, SVGStringList: 0, SVGTransformList: 0, SourceBufferList: 0, StyleSheetList: 0, TextTrackCueList: 0, TextTrackList: 0, TouchList: 0 }, Fp = Dp === Object.prototype ? void 0 : Dp, Np = Lp, _p = fe, Vp = function(t2) {
        if (t2 && t2.forEach !== Np) try {
          _p(t2, "forEach", Np);
        } catch (r2) {
          t2.forEach = Np;
        }
      };
      for (var Wp in Bp) Bp[Wp] && Vp(jp[Wp] && jp[Wp].prototype);
      Vp(Fp);
      var Gp = ["windows1251", "utf-16", "utf-16be", "utf-8"];
      function Yp(t2) {
        var r2 = [];
        switch (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "windows1251") {
          case "utf8":
          case "utf-8":
            r2 = function(t3) {
              for (var r3 = [], e3 = 0; e3 < t3.length; e3++) {
                var n3 = t3.charCodeAt(e3);
                n3 < 128 ? r3.push(n3) : n3 < 2048 ? r3.push(192 | n3 >> 6, 128 | 63 & n3) : n3 < 55296 || n3 >= 57344 ? r3.push(224 | n3 >> 12, 128 | n3 >> 6 & 63, 128 | 63 & n3) : (e3++, n3 = 65536 + ((1023 & n3) << 10 | 1023 & t3.charCodeAt(e3)), r3.push(240 | n3 >> 18, 128 | n3 >> 12 & 63, 128 | n3 >> 6 & 63, 128 | 63 & n3));
              }
              return r3;
            }(t2);
            break;
          case "utf16":
          case "utf16be":
          case "utf-16":
          case "utf-16be":
            for (var e2 = new ArrayBuffer(2 * t2.length), n2 = new Uint16Array(e2), i2 = new Uint8Array(e2), o2 = 0; o2 < t2.length; o2++) n2[o2] = t2.charCodeAt(o2);
            r2 = [255, 254], i2.forEach(function(t3) {
              return r2.push(t3);
            });
            break;
          default:
            for (var a2 = 0; a2 < t2.length; a2++) r2.push(t2.charCodeAt(a2));
        }
        return r2;
      }
      function $p(t2) {
        return t2 instanceof ArrayBuffer || "undefined" != typeof Buffer && t2 instanceof Buffer;
      }
      var zp = function(t2) {
        !function(t3, r3) {
          if ("function" != typeof r3 && null !== r3) throw new TypeError("Super expression must either be null or a function");
          t3.prototype = Object.create(r3 && r3.prototype, { constructor: { value: t3, writable: true, configurable: true } }), Object.defineProperty(t3, "prototype", { writable: false }), r3 && s(t3, r3);
        }(a2, t2);
        var r2, e2, i2 = (r2 = a2, e2 = c(), function() {
          var t3, n2 = u(r2);
          if (e2) {
            var i3 = u(this).constructor;
            t3 = Reflect.construct(n2, arguments, i3);
          } else t3 = n2.apply(this, arguments);
          return v(this, t3);
        });
        function a2() {
          n(this, a2);
          for (var t3 = arguments.length, r3 = new Array(t3), e3 = 0; e3 < t3; e3++) r3[e3] = arguments[e3];
          return ("number" == typeof r3[0] || Array.isArray(r3[0])) && (r3[0] = new Uint8Array(r3[0])), ArrayBuffer.isView(r3[0]) && (r3[0] = r3[0].buffer), i2.call.apply(i2, [this].concat(r3));
        }
        return o(a2, [{ key: "getString", value: function(t3, r3) {
          var e3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "windows1251", n2 = "", i3 = this.getUint8(t3, r3);
          switch (Array.isArray(i3) || (i3 = [i3]), e3) {
            case "utf8":
            case "utf-8":
              n2 = function(t4) {
                var r4 = "", e4 = 0, n3 = 0, i4 = 0, o3 = 0;
                for (e4 += 239 === t4[0] && 187 === t4[1] && 191 === t4[2] ? 3 : 0; e4 < t4.length; ) switch ((n3 = t4[e4++]) >> 4) {
                  case 0:
                  case 1:
                  case 2:
                  case 3:
                  case 4:
                  case 5:
                  case 6:
                  case 7:
                    r4 += String.fromCharCode(n3);
                    break;
                  case 12:
                  case 13:
                    i4 = t4[e4++], r4 += String.fromCharCode((31 & n3) << 6 | 63 & i4);
                    break;
                  case 14:
                    i4 = t4[e4++], o3 = t4[e4++], r4 += String.fromCharCode((15 & n3) << 12 | (63 & i4) << 6 | 63 & o3);
                    break;
                  default:
                    r4 += "";
                }
                return r4;
              }(i3);
              break;
            case "utf16":
            case "utf16be":
            case "utf-16":
            case "utf-16be":
              var o2 = null;
              255 === i3[0] && 254 === i3[1] ? o2 = true : 254 === i3[0] && 255 === i3[1] && (o2 = false), null !== o2 && (t3 += 2, r3 -= 2), n2 = this.getUint16String(t3, r3, true === o2);
              break;
            default:
              n2 = this.getUint8String(t3, r3);
          }
          return { string: n2.endsWith("\0") ? n2.substring(0, n2.length - 1) : n2, length: i3.length };
        } }, { key: "getCString", value: function(t3) {
          var r3, e3, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "windows1251", i3 = this.byteLength - t3;
          switch (n2) {
            case "utf16":
            case "utf16be":
            case "utf-16":
            case "utf-16be":
              e3 = 2, r3 = this.getUint16(t3, i3);
              break;
            default:
              e3 = 1, r3 = this.getUint8(t3, i3);
          }
          Array.isArray(r3) || (r3 = [r3]);
          for (var o2 = 0; o2 < r3.length; o2++) if (0 === r3[o2]) {
            i3 = (o2 + 1) * e3;
            break;
          }
          return this.getString(t3, i3, n2);
        } }, { key: "getUint8String", value: function(t3, r3) {
          var e3 = this.getUint8(t3, r3), n2 = "";
          Array.isArray(e3) || (e3 = [e3]);
          for (var i3 = 0; i3 < e3.length; i3++) {
            n2 += String.fromCharCode(e3[i3]);
          }
          return n2;
        } }, { key: "getUint16String", value: function(t3, r3) {
          var e3 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], n2 = this.getUint16(t3, r3, e3), i3 = "";
          Array.isArray(n2) || (n2 = [n2]);
          for (var o2 = 0; o2 < n2.length; o2++) {
            i3 += String.fromCharCode(n2[o2]);
          }
          return i3;
        } }, { key: "getUint8", value: function(t3) {
          var r3 = t3 + (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1), e3 = [];
          if (this.byteLength - r3 < 0) return false;
          for (var n2 = t3; n2 < r3; n2++) {
            var i3 = DataView.prototype.getUint8.call(this, n2);
            e3.push(i3);
          }
          return 1 === e3.length ? e3[0] : e3;
        } }, { key: "getUint16", value: function(t3) {
          for (var r3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2, e3 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2]; r3 % 2 != 0; ) r3 -= 1;
          var n2 = t3 + r3, i3 = [];
          if (this.byteLength - n2 < 0) return false;
          for (var o2 = t3; o2 < n2; o2 += 2) {
            var a3 = DataView.prototype.getUint16.call(this, o2, e3);
            i3.push(a3);
          }
          return 1 === i3.length ? i3[0] : i3;
        } }, { key: "getUint24", value: function(t3) {
          for (var r3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3, e3 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2]; r3 % 3 != 0; ) r3 -= 1;
          var n2 = t3 + r3, i3 = [];
          if (this.byteLength - n2 < 0 || r3 <= 0) return false;
          for (var o2 = t3; o2 < n2; o2 += 3) {
            var a3 = DataView.prototype.getUint16.call(this, o2, e3), u2 = DataView.prototype.getUint8.call(this, o2 + 2), s2 = e3 ? (u2 << 16) + a3 : (a3 << 8) + u2;
            i3.push(s2);
          }
          return 1 === i3.length ? i3[0] : i3;
        } }, { key: "setUint24", value: function(t3, r3) {
          var e3 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          if (r3 > 16777215) return false;
          e3 ? (DataView.prototype.setUint16.call(this, t3 + 1, r3 >> 8, e3), DataView.prototype.setUint8.call(this, t3, 255 & r3)) : (DataView.prototype.setUint16.call(this, t3, r3 >> 8, e3), DataView.prototype.setUint8.call(this, t3 + 2, 255 & r3));
        } }], [{ key: "isViewable", value: function(t3) {
          return !!($p(t3) || Array.isArray(t3) || ArrayBuffer.isView(t3));
        } }]), a2;
      }(l(DataView)), Kp = Jr, Hp = function() {
        var t2 = Kp(this), r2 = "";
        return t2.hasIndices && (r2 += "d"), t2.global && (r2 += "g"), t2.ignoreCase && (r2 += "i"), t2.multiline && (r2 += "m"), t2.dotAll && (r2 += "s"), t2.unicode && (r2 += "u"), t2.unicodeSets && (r2 += "v"), t2.sticky && (r2 += "y"), r2;
      }, Xp = A, Jp = m.RegExp, Zp = Xp(function() {
        var t2 = Jp("a", "y");
        return t2.lastIndex = 2, null !== t2.exec("abcd");
      }), qp = Zp || Xp(function() {
        return !Jp("a", "y").sticky;
      }), Qp = Zp || Xp(function() {
        var t2 = Jp("^r", "gy");
        return t2.lastIndex = 2, null !== t2.exec("str");
      }), ty = { BROKEN_CARET: Qp, MISSED_STICKY: qp, UNSUPPORTED_Y: Zp }, ry = A, ey = m.RegExp, ny = ry(function() {
        var t2 = ey(".", "s");
        return !(t2.dotAll && t2.exec("\n") && "s" === t2.flags);
      }), iy = A, oy = m.RegExp, ay = iy(function() {
        var t2 = oy("(?<a>b)", "g");
        return "b" !== t2.exec("b").groups.a || "bc" !== "b".replace(t2, "$<a>c");
      }), uy = x, sy = N, cy = fp, fy = Hp, ly = ty, vy = Ji, hy = $e.get, dy = ny, gy = ay, py = qt("native-string-replace", String.prototype.replace), yy = RegExp.prototype.exec, wy = yy, by = sy("".charAt), my = sy("".indexOf), Ey = sy("".replace), Ay = sy("".slice), Ty = function() {
        var t2 = /a/, r2 = /b*/g;
        return uy(yy, t2, "a"), uy(yy, r2, "a"), 0 !== t2.lastIndex || 0 !== r2.lastIndex;
      }(), Sy = ly.BROKEN_CARET, Iy = void 0 !== /()??/.exec("")[1];
      (Ty || Iy || Sy || dy || gy) && (wy = function(t2) {
        var r2, e2, n2, i2, o2, a2, u2, s2 = this, c2 = hy(s2), f2 = cy(t2), l2 = c2.raw;
        if (l2) return l2.lastIndex = s2.lastIndex, r2 = uy(wy, l2, f2), s2.lastIndex = l2.lastIndex, r2;
        var v2 = c2.groups, h2 = Sy && s2.sticky, d2 = uy(fy, s2), g2 = s2.source, p2 = 0, y2 = f2;
        if (h2 && (d2 = Ey(d2, "y", ""), -1 === my(d2, "g") && (d2 += "g"), y2 = Ay(f2, s2.lastIndex), s2.lastIndex > 0 && (!s2.multiline || s2.multiline && "\n" !== by(f2, s2.lastIndex - 1)) && (g2 = "(?: " + g2 + ")", y2 = " " + y2, p2++), e2 = new RegExp("^(?:" + g2 + ")", d2)), Iy && (e2 = new RegExp("^" + g2 + "$(?!\\s)", d2)), Ty && (n2 = s2.lastIndex), i2 = uy(yy, h2 ? e2 : s2, y2), h2 ? i2 ? (i2.input = Ay(i2.input, p2), i2[0] = Ay(i2[0], p2), i2.index = s2.lastIndex, s2.lastIndex += i2[0].length) : s2.lastIndex = 0 : Ty && i2 && (s2.lastIndex = s2.global ? i2.index + i2[0].length : n2), Iy && i2 && i2.length > 1 && uy(py, i2[0], e2, function() {
          for (o2 = 1; o2 < arguments.length - 2; o2++) void 0 === arguments[o2] && (i2[o2] = void 0);
        }), i2 && v2) for (i2.groups = a2 = vy(null), o2 = 0; o2 < v2.length; o2++) a2[(u2 = v2[o2])[0]] = i2[u2[1]];
        return i2;
      });
      var Oy = wy;
      bi({ target: "RegExp", proto: true, forced: /./.exec !== Oy }, { exec: Oy });
      var xy = xa, ky = gn, Py = Oy, Ry = A, Cy = wr, Uy = fe, Ly = Cy("species"), My = RegExp.prototype, Dy = function(t2, r2, e2, n2) {
        var i2 = Cy(t2), o2 = !Ry(function() {
          var r3 = {};
          return r3[i2] = function() {
            return 7;
          }, 7 !== ""[t2](r3);
        }), a2 = o2 && !Ry(function() {
          var r3 = false, e3 = /a/;
          return "split" === t2 && ((e3 = {}).constructor = {}, e3.constructor[Ly] = function() {
            return e3;
          }, e3.flags = "", e3[i2] = /./[i2]), e3.exec = function() {
            return r3 = true, null;
          }, e3[i2](""), !r3;
        });
        if (!o2 || !a2 || e2) {
          var u2 = xy(/./[i2]), s2 = r2(i2, ""[t2], function(t3, r3, e3, n3, i3) {
            var a3 = xy(t3), s3 = r3.exec;
            return s3 === Py || s3 === My.exec ? o2 && !i3 ? { done: true, value: u2(r3, e3, n3) } : { done: true, value: a3(e3, r3, n3) } : { done: false };
          });
          ky(String.prototype, t2, s2[0]), ky(My, i2, s2[1]);
        }
        n2 && Uy(My[i2], "sham", true);
      }, jy = N, By = En, Fy = fp, Ny = q, _y = jy("".charAt), Vy = jy("".charCodeAt), Wy = jy("".slice), Gy = function(t2) {
        return function(r2, e2) {
          var n2, i2, o2 = Fy(Ny(r2)), a2 = By(e2), u2 = o2.length;
          return a2 < 0 || a2 >= u2 ? t2 ? "" : void 0 : (n2 = Vy(o2, a2)) < 55296 || n2 > 56319 || a2 + 1 === u2 || (i2 = Vy(o2, a2 + 1)) < 56320 || i2 > 57343 ? t2 ? _y(o2, a2) : n2 : t2 ? Wy(o2, a2, a2 + 2) : i2 - 56320 + (n2 - 55296 << 10) + 65536;
        };
      }, Yy = { codeAt: Gy(false), charAt: Gy(true) }, $y = Yy.charAt, zy = function(t2, r2, e2) {
        return r2 + (e2 ? $y(t2, r2).length : 1);
      }, Ky = N, Hy = rr, Xy = Math.floor, Jy = Ky("".charAt), Zy = Ky("".replace), qy = Ky("".slice), Qy = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, tw = /\$([$&'`]|\d{1,2})/g, rw = x, ew = Jr, nw = ot, iw = G, ow = Oy, aw = TypeError, uw = function(t2, r2) {
        var e2 = t2.exec;
        if (nw(e2)) {
          var n2 = rw(e2, t2, r2);
          return null !== n2 && ew(n2), n2;
        }
        if ("RegExp" === iw(t2)) return rw(ow, t2, r2);
        throw aw("RegExp#exec called on incompatible receiver");
      }, sw = Uh, cw = x, fw = N, lw = Dy, vw = A, hw = Jr, dw = ot, gw = X, pw = En, yw = kn, ww = fp, bw = q, mw = zy, Ew = Nt, Aw = function(t2, r2, e2, n2, i2, o2) {
        var a2 = e2 + t2.length, u2 = n2.length, s2 = tw;
        return void 0 !== i2 && (i2 = Hy(i2), s2 = Qy), Zy(o2, s2, function(o3, s3) {
          var c2;
          switch (Jy(s3, 0)) {
            case "$":
              return "$";
            case "&":
              return t2;
            case "`":
              return qy(r2, 0, e2);
            case "'":
              return qy(r2, a2);
            case "<":
              c2 = i2[qy(s3, 1, -1)];
              break;
            default:
              var f2 = +s3;
              if (0 === f2) return o3;
              if (f2 > u2) {
                var l2 = Xy(f2 / 10);
                return 0 === l2 ? o3 : l2 <= u2 ? void 0 === n2[l2 - 1] ? Jy(s3, 1) : n2[l2 - 1] + Jy(s3, 1) : o3;
              }
              c2 = n2[f2 - 1];
          }
          return void 0 === c2 ? "" : c2;
        });
      }, Tw = uw, Sw = wr("replace"), Iw = Math.max, Ow = Math.min, xw = fw([].concat), kw = fw([].push), Pw = fw("".indexOf), Rw = fw("".slice), Cw = "$0" === "a".replace(/./, "$0"), Uw = !!/./[Sw] && "" === /./[Sw]("a", "$0"), Lw = !vw(function() {
        var t2 = /./;
        return t2.exec = function() {
          var t3 = [];
          return t3.groups = { a: "7" }, t3;
        }, "7" !== "".replace(t2, "$<a>");
      });
      lw("replace", function(t2, r2, e2) {
        var n2 = Uw ? "$" : "$0";
        return [function(t3, e3) {
          var n3 = bw(this), i2 = gw(t3) ? void 0 : Ew(t3, Sw);
          return i2 ? cw(i2, t3, n3, e3) : cw(r2, ww(n3), t3, e3);
        }, function(t3, i2) {
          var o2 = hw(this), a2 = ww(t3);
          if ("string" == typeof i2 && -1 === Pw(i2, n2) && -1 === Pw(i2, "$<")) {
            var u2 = e2(r2, o2, a2, i2);
            if (u2.done) return u2.value;
          }
          var s2 = dw(i2);
          s2 || (i2 = ww(i2));
          var c2, f2 = o2.global;
          f2 && (c2 = o2.unicode, o2.lastIndex = 0);
          for (var l2, v2 = []; null !== (l2 = Tw(o2, a2)) && (kw(v2, l2), f2); ) {
            "" === ww(l2[0]) && (o2.lastIndex = mw(a2, yw(o2.lastIndex), c2));
          }
          for (var h2, d2 = "", g2 = 0, p2 = 0; p2 < v2.length; p2++) {
            for (var y2, w2 = ww((l2 = v2[p2])[0]), b2 = Iw(Ow(pw(l2.index), a2.length), 0), m2 = [], E2 = 1; E2 < l2.length; E2++) kw(m2, void 0 === (h2 = l2[E2]) ? h2 : String(h2));
            var A2 = l2.groups;
            if (s2) {
              var T2 = xw([w2], m2, b2, a2);
              void 0 !== A2 && kw(T2, A2), y2 = ww(sw(i2, void 0, T2));
            } else y2 = Aw(w2, a2, b2, m2, A2, i2);
            b2 >= g2 && (d2 += Rw(a2, g2, b2) + y2, g2 = b2 + w2.length);
          }
          return d2 + Rw(a2, g2);
        }];
      }, !Lw || !Cw || Uw);
      var Mw = N, Dw = gn, jw = Date.prototype, Bw = "Invalid Date", Fw = "toString", Nw = Mw(jw[Fw]), _w = Mw(jw.getTime);
      String(/* @__PURE__ */ new Date(NaN)) !== Bw && Dw(jw, Fw, function() {
        var t2 = _w(this);
        return t2 == t2 ? Nw(this) : Bw;
      });
      var Vw = x, Ww = ir, Gw = vt, Yw = Hp, $w = RegExp.prototype, zw = function(t2) {
        var r2 = t2.flags;
        return void 0 !== r2 || "flags" in $w || Ww(t2, "flags") || !Gw($w, t2) ? r2 : Vw(Yw, t2);
      }, Kw = ye.PROPER, Hw = gn, Xw = Jr, Jw = fp, Zw = A, qw = zw, Qw = "toString", tb = RegExp.prototype[Qw], rb = Zw(function() {
        return "/a/b" !== tb.call({ source: "a", flags: "b" });
      }), eb = Kw && tb.name !== Qw;
      (rb || eb) && Hw(RegExp.prototype, Qw, function() {
        var t2 = Xw(this);
        return "/" + Jw(t2.source) + "/" + Jw(qw(t2));
      }, { unsafe: true });
      var nb = "	\n\v\f\r  \u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF", ib = q, ob = fp, ab = nb, ub = N("".replace), sb = RegExp("^[" + ab + "]+"), cb = RegExp("(^|[^" + ab + "])[" + ab + "]+$"), fb = function(t2) {
        return function(r2) {
          var e2 = ob(ib(r2));
          return 1 & t2 && (e2 = ub(e2, sb, "")), 2 & t2 && (e2 = ub(e2, cb, "$1")), e2;
        };
      }, lb = { start: fb(1), end: fb(2), trim: fb(3) }, vb = m, hb = A, db = N, gb = fp, pb = lb.trim, yb = nb, wb = vb.parseInt, bb = vb.Symbol, mb = bb && bb.iterator, Eb = /^[+-]?0x/i, Ab = db(Eb.exec), Tb = 8 !== wb(yb + "08") || 22 !== wb(yb + "0x16") || mb && !hb(function() {
        wb(Object(mb));
      }) ? function(t2, r2) {
        var e2 = pb(gb(t2));
        return wb(e2, r2 >>> 0 || (Ab(Eb, e2) ? 16 : 10));
      } : wb;
      bi({ global: true, forced: parseInt !== Tb }, { parseInt: Tb });
      var Sb = Dn.includes, Ib = oo;
      bi({ target: "Array", proto: true, forced: A(function() {
        return !Array(1).includes();
      }) }, { includes: function(t2) {
        return Sb(this, t2, arguments.length > 1 ? arguments[1] : void 0);
      } }), Ib("includes");
      var Ob = bi, xb = Dn.indexOf, kb = Mh, Pb = xa([].indexOf), Rb = !!Pb && 1 / Pb([1], 1, -0) < 0;
      function Cb(t2, r2) {
        return (t2 & 1 << r2) > 0;
      }
      function Ub(t2, r2) {
        return t2 | 1 << r2;
      }
      function Lb(t2) {
        for (var r2 = 0, e2 = 2130706432; e2; ) r2 >>= 1, r2 |= t2 & e2, e2 >>= 8;
        return r2;
      }
      function Mb(t2) {
        for (var r2 = 0, e2 = 127; 2147483647 ^ e2; ) r2 = t2 & ~e2, r2 <<= 1, r2 |= t2 & e2, e2 = (e2 + 1 << 8) - 1, t2 = r2;
        return r2;
      }
      function Db() {
        for (var t2 = [], r2 = arguments.length, e2 = new Array(r2), n2 = 0; n2 < r2; n2++) e2[n2] = arguments[n2];
        return e2.forEach(function(r3) {
          r3.forEach ? r3.forEach(function(r4) {
            return t2.push(r4);
          }) : t2.push(r3);
        }), new Uint8Array(t2);
      }
      function jb(t2, r2) {
        for (var e2 = [], n2 = (t2 = t2 || []).length, i2 = r2 - n2, o2 = 0; o2 < i2; o2++) e2.push(0);
        for (var a2 = 0; a2 < n2; a2++) e2.push(t2[a2]);
        return e2;
      }
      function Bb(t2) {
        for (var r2 = 0, e2 = 0; e2 < t2.length; e2++) r2 = 256 * r2 + t2[e2];
        return r2;
      }
      function Fb(t2) {
        for (var r2 = []; t2 > 0; ) {
          var e2 = 255 & t2;
          r2.unshift(e2), t2 = (t2 - e2) / 256;
        }
        return r2;
      }
      Ob({ target: "Array", proto: true, forced: Rb || !kb("indexOf") }, { indexOf: function(t2) {
        var r2 = arguments.length > 1 ? arguments[1] : void 0;
        return Rb ? Pb(this, t2, r2) || 0 : xb(this, t2, r2);
      } });
      var Nb = ["Blues", "Classic Rock", "Country", "Dance", "Disco", "Funk", "Grunge", "Hip-Hop", "Jazz", "Metal", "New Age", "Oldies", "Other", "Pop", "R&B", "Rap", "Reggae", "Rock", "Techno", "Industrial", "Alternative", "Ska", "Death Metal", "Pranks", "Soundtrack", "Euro-Techno", "Ambient", "Trip-Hop", "Vocal", "Jazz+Funk", "Fusion", "Trance", "Classical", "Instrumental", "Acid", "House", "Game", "Sound Clip", "Gospel", "Noise", "Alt. Rock", "Bass", "Soul", "Punk", "Space", "Meditative", "Instrumental Pop", "Instrumental Rock", "Ethnic", "Gothic", "Darkwave", "Techno-Industrial", "Electronic", "Pop-Folk", "Eurodance", "Dream", "Southern Rock", "Comedy", "Cult", "Gangsta Rap", "Top 40", "Christian Rap", "Pop/Funk", "Jungle", "Native American", "Cabaret", "New Wave", "Psychedelic", "Rave", "Showtunes", "Trailer", "Lo-Fi", "Tribal", "Acid Punk", "Acid Jazz", "Polka", "Retro", "Musical", "Rock & Roll", "Hard Rock", "Folk", "Folk-Rock", "National Folk", "Swing", "Fast-Fusion", "Bebop", "Latin", "Revival", "Celtic", "Bluegrass", "Avantgarde", "Gothic Rock", "Progressive Rock", "Psychedelic Rock", "Symphonic Rock", "Slow Rock", "Big Band", "Chorus", "Easy Listening", "Acoustic", "Humour", "Speech", "Chanson", "Opera", "Chamber Music", "Sonata", "Symphony", "Booty Bass", "Primus", "Porn Groove", "Satire", "Slow Jam", "Club", "Tango", "Samba", "Folklore", "Ballad", "Power Ballad", "Rhythmic Soul", "Freestyle", "Duet", "Punk Rock", "Drum Solo", "A Cappella", "Euro-House", "Dance Hall", "Goa", "Drum & Bass", "Club-House", "Hardcore", "Terror", "Indie", "BritPop", "Afro-Punk", "Polsk Punk", "Beat", "Christian Gangsta Rap", "Heavy Metal", "Black Metal", "Crossover", "Contemporary Christian", "Christian Rock", "Merengue", "Salsa", "Thrash Metal", "Anime", "JPop", "Synthpop", "Abstract", "Art Rock", "Baroque", "Bhangra", "Big Beat", "Breakbeat", "Chillout", "Downtempo", "Dub", "EBM", "Eclectic", "Electro", "Electroclash", "Emo", "Experimental", "Garage", "Global", "IDM", "Illbient", "Industro-Goth", "Jam Band", "Krautrock", "Leftfield", "Lounge", "Math Rock", "New Romantic", "Nu-Breakz", "Post-Punk", "Post-Rock", "Psytrance", "Shoegaze", "Space Rock", "Trop Rock", "World Music", "Neoclassical", "Audiobook", "Audio Theatre", "Neue Deutsche Welle", "Podcast", "Indie Rock", "G-Funk", "Dubstep", "Garage Rock", "Psybient"];
      function _b(t2) {
        var r2 = t2.byteLength - 128;
        return r2 > -1 && "TAG" === new zp(t2, r2).getString(0, 3).string;
      }
      var Vb = T, Wb = Ca, Gb = Hp, Yb = A, $b = m.RegExp, zb = $b.prototype, Kb = Vb && Yb(function() {
        var t2 = true;
        try {
          $b(".", "d");
        } catch (r3) {
          t2 = false;
        }
        var r2 = {}, e2 = "", n2 = t2 ? "dgimsy" : "gimsy", i2 = function(t3, n3) {
          Object.defineProperty(r2, t3, { get: function() {
            return e2 += n3, true;
          } });
        }, o2 = { dotAll: "s", global: "g", ignoreCase: "i", multiline: "m", sticky: "y" };
        for (var a2 in t2 && (o2.hasIndices = "d"), o2) i2(a2, o2[a2]);
        return Object.getOwnPropertyDescriptor(zb, "flags").get.call(r2) !== n2 || e2 !== n2;
      });
      Kb && Wb(zb, "flags", { configurable: true, get: Gb });
      var Hb = x, Xb = Jr, Jb = Nt, Zb = Jr, qb = function(t2, r2, e2) {
        var n2, i2;
        Xb(t2);
        try {
          if (!(n2 = Jb(t2, "return"))) {
            if ("throw" === r2) throw e2;
            return e2;
          }
          n2 = Hb(n2, t2);
        } catch (t3) {
          i2 = true, n2 = t3;
        }
        if ("throw" === r2) throw e2;
        if (i2) throw n2;
        return Xb(n2), e2;
      }, Qb = wf, tm = x, rm = rr, em = function(t2, r2, e2, n2) {
        try {
          return n2 ? r2(Zb(e2)[0], e2[1]) : r2(e2);
        } catch (r3) {
          qb(t2, "throw", r3);
        }
      }, nm = Df, im = js, om = Rn, am = nu, um = Cf, sm = Sf, cm = Array, fm = function(t2) {
        var r2 = rm(t2), e2 = im(this), n2 = arguments.length, i2 = n2 > 1 ? arguments[1] : void 0, o2 = void 0 !== i2;
        o2 && (i2 = Qb(i2, n2 > 2 ? arguments[2] : void 0));
        var a2, u2, s2, c2, f2, l2, v2 = sm(r2), h2 = 0;
        if (!v2 || this === cm && nm(v2)) for (a2 = om(r2), u2 = e2 ? new this(a2) : cm(a2); a2 > h2; h2++) l2 = o2 ? i2(r2[h2], h2) : r2[h2], am(u2, h2, l2);
        else for (f2 = (c2 = um(r2, v2)).next, u2 = e2 ? new this() : []; !(s2 = tm(f2, c2)).done; h2++) l2 = o2 ? em(c2, i2, [s2.value, h2], true) : s2.value, am(u2, h2, l2);
        return u2.length = h2, u2;
      };
      bi({ target: "Array", stat: true, forced: !gc(function(t2) {
        Array.from(t2);
      }) }, { from: fm });
      var lm = Yy.charAt, vm = fp, hm = $e, dm = fa, gm = la, pm = "String Iterator", ym = hm.set, wm = hm.getterFor(pm);
      dm(String, "String", function(t2) {
        ym(this, { type: pm, string: vm(t2), index: 0 });
      }, function() {
        var t2, r2 = wm(this), e2 = r2.string, n2 = r2.index;
        return n2 >= e2.length ? gm(void 0, true) : (t2 = lm(e2, n2), r2.index += t2.length, gm(t2, false));
      });
      var bm = bi, mm = yp, Em = q, Am = fp, Tm = bp, Sm = N("".indexOf);
      function Im(t2, r2) {
        var e2 = new zp(t2), n2 = Gp[e2.getUint8(0)], i2 = e2.byteLength - 1;
        return 3 === r2 || 2 === r2 ? e2.getCString(1, n2).string.replace(/\//g, "\\\\") : e2.getString(1, i2, n2).string.replace(/\0/g, "\\\\");
      }
      function Om(t2, r2) {
        var e2 = new zp(t2), n2 = Gp[e2.getUint8(0)], i2 = e2.byteLength - 1;
        return 3 === r2 || 2 === r2 ? e2.getCString(1, n2).string : e2.getString(1, i2, n2).string.replace(/\0/g, "\\\\");
      }
      function xm(t2, r2) {
        var e2 = new zp(t2), n2 = Gp[e2.getUint8(0)], i2 = e2.byteLength - 1;
        return e2.getString(1, i2, n2).string.replace(/\0/g, "\\\\");
      }
      function km(t2, r2) {
        return new zp(t2).getCString(0).string;
      }
      function Pm(t2, r2) {
        var e2 = new zp(t2), n2 = Gp[e2.getUint8(0)], i2 = e2.getCString(1, n2), o2 = i2.length + 1, a2 = e2.byteLength - o2, u2 = e2.getString(o2, a2, n2);
        return { description: i2.string, text: u2.string };
      }
      function Rm(t2, r2) {
        var e2 = new zp(t2), n2 = Gp[e2.getUint8(0)], i2 = e2.getCString(1, n2), o2 = i2.length + 1, a2 = e2.byteLength - o2, u2 = e2.getString(o2, a2);
        return { description: i2.string, url: u2.string };
      }
      function Cm(t2, r2) {
        var e2 = new zp(t2), n2 = Gp[e2.getUint8(0)], i2 = e2.getCString(4, n2), o2 = i2.length + 4, a2 = e2.byteLength - o2, u2 = e2.getString(o2, a2, n2);
        return { language: e2.getString(1, 3).string, descriptor: i2.string, text: u2.string };
      }
      function Um(t2, r2) {
        var e2 = new zp(t2), n2 = Gp[e2.getUint8(0)], i2 = e2.byteLength - 1;
        return e2.getString(1, i2, n2).string;
      }
      function Lm(t2, r2) {
        var e2 = new zp(t2), n2 = Gp[e2.getUint8(0)], i2 = e2.getCString(1), o2 = e2.getUint8(i2.length + 1), a2 = e2.getCString(i2.length + 2, n2), u2 = i2.length + a2.length + 2, s2 = e2.byteLength - u2, c2 = e2.getUint8(u2, s2), f2 = Array.isArray(c2) ? c2 : [c2];
        return { format: i2.string, type: o2, description: a2.string, data: f2 };
      }
      function Mm(t2, r2) {
        var e2 = new zp(t2), n2 = Gp[e2.getUint8(0)], i2 = e2.getCString(1), o2 = e2.getCString(i2.length + 1, n2), a2 = e2.getCString(o2.length + i2.length + 1, n2), u2 = i2.length + o2.length + a2.length + 1, s2 = e2.byteLength - u2, c2 = e2.getUint8(u2, s2), f2 = Array.isArray(c2) ? c2 : [c2];
        return { format: i2.string, filename: o2.string, description: a2.string, object: f2 };
      }
      function Dm(t2, r2) {
        for (var e2 = new zp(t2), n2 = e2.getUint8(0), i2 = e2.getUint8(1), o2 = [], a2 = Math.ceil(i2 / 8), u2 = 2; u2 < e2.byteLength; u2 += a2) o2.push(e2.getUint8(u2, a2));
        return { bitsvolume: i2, incdec: { right: Cb(n2, 0), left: Cb(n2, 1), rightback: Cb(n2, 2), leftback: Cb(n2, 3), center: Cb(n2, 4), bass: Cb(n2, 5) }, volumechange: { right: void 0 !== o2[0] ? o2[0] : [], left: void 0 !== o2[1] ? o2[1] : [], rightback: void 0 !== o2[4] ? o2[4] : [], leftback: void 0 !== o2[5] ? o2[5] : [], center: void 0 !== o2[8] ? o2[8] : [], bass: void 0 !== o2[10] ? o2[10] : [] }, peakvolume: { right: void 0 !== o2[2] ? o2[2] : [], left: void 0 !== o2[3] ? o2[3] : [], rightback: void 0 !== o2[6] ? o2[6] : [], leftback: void 0 !== o2[7] ? o2[7] : [], center: void 0 !== o2[9] ? o2[9] : [], bass: void 0 !== o2[11] ? o2[11] : [] } };
      }
      function jm(t2, r2) {
        var e2 = Math.floor(t2 / 6e4).toString(), n2 = Math.floor(t2 % 6e4 / 1e3).toString();
        n2 = 1 === n2.length ? "0" + n2 : n2;
        for (var i2 = (t2 % 1e3).toString(); i2.length < 3; ) i2 = "0" + i2;
        return "[".concat(e2, ":").concat(n2, ".").concat(i2, "] ").concat(r2, "\n");
      }
      function Bm(t2, r2) {
        for (var e2 = new zp(t2), n2 = Gp[e2.getUint8(0)], i2 = e2.getString(1, 3).string, o2 = e2.getUint8(4), a2 = e2.getUint8(5), u2 = e2.getCString(6, n2), s2 = u2.string, c2 = u2.length + 6, f2 = e2.byteLength - c2, l2 = e2.getUint8(c2, f2), v2 = new zp(Array.isArray(l2) ? l2 : [l2]), h2 = [], d2 = "", g2 = 0; g2 < l2.length; g2 += 4) {
          var p2 = v2.getCString(g2, n2), y2 = p2.string, w2 = v2.getUint32(g2 + p2.length);
          h2.push({ time: w2, line: y2 }), d2 += jm(w2, y2), g2 += p2.length;
        }
        return { language: i2, format: o2, type: a2, descriptor: s2, data: h2, lyrics: d2 };
      }
      function Fm(t2, r2) {
        var e2 = new zp(t2), n2 = e2.getUint8(0, e2.byteLength);
        return { data: Array.isArray(n2) ? n2 : [n2] };
      }
      function Nm(t2, r2) {
        for (var e2 = new zp(t2), n2 = e2.getUint8(0), i2 = e2.getUint8(1, e2.byteLength - 1), o2 = new zp(Array.isArray(i2) ? i2 : [i2]), a2 = [], u2 = 0; u2 < i2.length; u2 += 5) {
          var s2 = o2.getUint8(u2);
          255 === s2 && (s2 += o2.getUint8(++u2));
          var c2 = o2.getUint32(u2 + 1);
          a2.push({ bpm: s2, time: c2 });
        }
        return { format: n2, data: a2 };
      }
      function _m(t2, r2) {
        for (var e2 = new zp(t2), n2 = e2.getUint8(0), i2 = e2.getUint8(1, e2.byteLength - 1), o2 = new zp(Array.isArray(i2) ? i2 : [i2]), a2 = [], u2 = 0; u2 < i2.length; u2 += 5) {
          var s2 = o2.getUint8(u2), c2 = o2.getUint32(u2 + 1);
          a2.push({ event: s2, time: c2 });
        }
        return { format: n2, data: a2 };
      }
      function Vm(t2, r2) {
        var e2 = new zp(t2), n2 = e2.getUint8(0, e2.byteLength);
        return Bb(Array.isArray(n2) ? n2 : [n2]).toString();
      }
      function Wm(t2, r2) {
        var e2 = new zp(t2), n2 = Gp[0], i2 = e2.getCString(0, n2), o2 = e2.getUint8(i2.length), a2 = i2.length + 1, u2 = t2.byteLength - a2, s2 = 0;
        if (u2 > 0) {
          var c2 = e2.getUint8(a2, u2);
          s2 = Bb(Array.isArray(c2) ? c2 : [c2]);
        }
        return { email: i2.string, rating: o2, counter: s2 };
      }
      bm({ target: "String", proto: true, forced: !Tm("includes") }, { includes: function(t2) {
        return !!~Sm(Am(Em(this)), Am(mm(t2)), arguments.length > 1 ? arguments[1] : void 0);
      } });
      var Gm = x, Ym = Jr, $m = X, zm = kn, Km = fp, Hm = q, Xm = Nt, Jm = zy, Zm = uw;
      Dy("match", function(t2, r2, e2) {
        return [function(r3) {
          var e3 = Hm(this), n2 = $m(r3) ? void 0 : Xm(r3, t2);
          return n2 ? Gm(n2, r3, e3) : new RegExp(r3)[t2](Km(e3));
        }, function(t3) {
          var n2 = Ym(this), i2 = Km(t3), o2 = e2(r2, n2, i2);
          if (o2.done) return o2.value;
          if (!n2.global) return Zm(n2, i2);
          var a2 = n2.unicode;
          n2.lastIndex = 0;
          for (var u2, s2 = [], c2 = 0; null !== (u2 = Zm(n2, i2)); ) {
            var f2 = Km(u2[0]);
            s2[c2] = f2, "" === f2 && (n2.lastIndex = Jm(i2, zm(n2.lastIndex), a2)), c2++;
          }
          return 0 === c2 ? null : s2;
        }];
      });
      var qm = {}, Qm = G, tE = rt, rE = pn.f, eE = cu, nE = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
      qm.f = function(t2) {
        return nE && "Window" === Qm(t2) ? function(t3) {
          try {
            return rE(t3);
          } catch (t4) {
            return eE(nE);
          }
        }(t2) : rE(tE(t2));
      };
      var iE = {}, oE = wr;
      iE.f = oE;
      var aE = m, uE = ir, sE = iE, cE = $r.f, fE = x, lE = lt, vE = wr, hE = gn, dE = bi, gE = m, pE = x, yE = N, wE = T, bE = St, mE = A, EE = ir, AE = vt, TE = Jr, SE = rt, IE = Pr, OE = fp, xE = M, kE = Ji, PE = Ti, RE = pn, CE = qm, UE = $n, LE = E, ME = $r, DE = mi, jE = k, BE = gn, FE = Ca, NE = qt, _E = Ce, VE = cr, WE = wr, GE = iE, YE = function(t2) {
        var r2 = aE.Symbol || (aE.Symbol = {});
        uE(r2, t2) || cE(r2, t2, { value: sE.f(t2) });
      }, $E = function() {
        var t2 = lE("Symbol"), r2 = t2 && t2.prototype, e2 = r2 && r2.valueOf, n2 = vE("toPrimitive");
        r2 && !r2[n2] && hE(r2, n2, function(t3) {
          return fE(e2, this);
        }, { arity: 1 });
      }, zE = Po, KE = $e, HE = ll.forEach, XE = Re("hidden"), JE = "Symbol", ZE = "prototype", qE = KE.set, QE = KE.getterFor(JE), tA = Object[ZE], rA = gE.Symbol, eA = rA && rA[ZE], nA = gE.TypeError, iA = gE.QObject, oA = LE.f, aA = ME.f, uA = CE.f, sA = jE.f, cA = yE([].push), fA = NE("symbols"), lA = NE("op-symbols"), vA = NE("wks"), hA = !iA || !iA[ZE] || !iA[ZE].findChild, dA = wE && mE(function() {
        return 7 !== kE(aA({}, "a", { get: function() {
          return aA(this, "a", { value: 7 }).a;
        } })).a;
      }) ? function(t2, r2, e2) {
        var n2 = oA(tA, r2);
        n2 && delete tA[r2], aA(t2, r2, e2), n2 && t2 !== tA && aA(tA, r2, n2);
      } : aA, gA = function(t2, r2) {
        var e2 = fA[t2] = kE(eA);
        return qE(e2, { type: JE, tag: t2, description: r2 }), wE || (e2.description = r2), e2;
      }, pA = function(t2, r2, e2) {
        t2 === tA && pA(lA, r2, e2), TE(t2);
        var n2 = IE(r2);
        return TE(e2), EE(fA, n2) ? (e2.enumerable ? (EE(t2, XE) && t2[XE][n2] && (t2[XE][n2] = false), e2 = kE(e2, { enumerable: xE(0, false) })) : (EE(t2, XE) || aA(t2, XE, xE(1, {})), t2[XE][n2] = true), dA(t2, n2, e2)) : aA(t2, n2, e2);
      }, yA = function(t2, r2) {
        TE(t2);
        var e2 = SE(r2), n2 = PE(e2).concat(EA(e2));
        return HE(n2, function(r3) {
          wE && !pE(wA, e2, r3) || pA(t2, r3, e2[r3]);
        }), t2;
      }, wA = function(t2) {
        var r2 = IE(t2), e2 = pE(sA, this, r2);
        return !(this === tA && EE(fA, r2) && !EE(lA, r2)) && (!(e2 || !EE(this, r2) || !EE(fA, r2) || EE(this, XE) && this[XE][r2]) || e2);
      }, bA = function(t2, r2) {
        var e2 = SE(t2), n2 = IE(r2);
        if (e2 !== tA || !EE(fA, n2) || EE(lA, n2)) {
          var i2 = oA(e2, n2);
          return !i2 || !EE(fA, n2) || EE(e2, XE) && e2[XE][n2] || (i2.enumerable = true), i2;
        }
      }, mA = function(t2) {
        var r2 = uA(SE(t2)), e2 = [];
        return HE(r2, function(t3) {
          EE(fA, t3) || EE(_E, t3) || cA(e2, t3);
        }), e2;
      }, EA = function(t2) {
        var r2 = t2 === tA, e2 = uA(r2 ? lA : SE(t2)), n2 = [];
        return HE(e2, function(t3) {
          !EE(fA, t3) || r2 && !EE(tA, t3) || cA(n2, fA[t3]);
        }), n2;
      };
      bE || (rA = function() {
        if (AE(eA, this)) throw nA("Symbol is not a constructor");
        var t2 = arguments.length && void 0 !== arguments[0] ? OE(arguments[0]) : void 0, r2 = VE(t2), e2 = function(t3) {
          this === tA && pE(e2, lA, t3), EE(this, XE) && EE(this[XE], r2) && (this[XE][r2] = false), dA(this, r2, xE(1, t3));
        };
        return wE && hA && dA(tA, r2, { configurable: true, set: e2 }), gA(r2, t2);
      }, BE(eA = rA[ZE], "toString", function() {
        return QE(this).tag;
      }), BE(rA, "withoutSetter", function(t2) {
        return gA(VE(t2), t2);
      }), jE.f = wA, ME.f = pA, DE.f = yA, LE.f = bA, RE.f = CE.f = mA, UE.f = EA, GE.f = function(t2) {
        return gA(WE(t2), t2);
      }, wE && (FE(eA, "description", { configurable: true, get: function() {
        return QE(this).description;
      } }), BE(tA, "propertyIsEnumerable", wA, { unsafe: true }))), dE({ global: true, constructor: true, wrap: true, forced: !bE, sham: !bE }, { Symbol: rA }), HE(PE(vA), function(t2) {
        YE(t2);
      }), dE({ target: JE, stat: true, forced: !bE }, { useSetter: function() {
        hA = true;
      }, useSimple: function() {
        hA = false;
      } }), dE({ target: "Object", stat: true, forced: !bE, sham: !wE }, { create: function(t2, r2) {
        return void 0 === r2 ? kE(t2) : yA(kE(t2), r2);
      }, defineProperty: pA, defineProperties: yA, getOwnPropertyDescriptor: bA }), dE({ target: "Object", stat: true, forced: !bE }, { getOwnPropertyNames: mA }), $E(), zE(rA, JE), _E[XE] = true;
      var AA = St && !!Symbol.for && !!Symbol.keyFor, TA = bi, SA = lt, IA = ir, OA = fp, xA = qt, kA = AA, PA = xA("string-to-symbol-registry"), RA = xA("symbol-to-string-registry");
      TA({ target: "Symbol", stat: true, forced: !kA }, { for: function(t2) {
        var r2 = OA(t2);
        if (IA(PA, r2)) return PA[r2];
        var e2 = SA("Symbol")(r2);
        return PA[r2] = e2, RA[e2] = r2, e2;
      } });
      var CA = bi, UA = ir, LA = Rt, MA = Ut, DA = AA, jA = qt("symbol-to-string-registry");
      CA({ target: "Symbol", stat: true, forced: !DA }, { keyFor: function(t2) {
        if (!LA(t2)) throw TypeError(MA(t2) + " is not a symbol");
        if (UA(jA, t2)) return jA[t2];
      } });
      var BA = Mi, FA = ot, NA = G, _A = fp, VA = N([].push), WA = bi, GA = lt, YA = Uh, $A = x, zA = N, KA = A, HA = ot, XA = Rt, JA = Od, ZA = function(t2) {
        if (FA(t2)) return t2;
        if (BA(t2)) {
          for (var r2 = t2.length, e2 = [], n2 = 0; n2 < r2; n2++) {
            var i2 = t2[n2];
            "string" == typeof i2 ? VA(e2, i2) : "number" != typeof i2 && "Number" !== NA(i2) && "String" !== NA(i2) || VA(e2, _A(i2));
          }
          var o2 = e2.length, a2 = true;
          return function(t3, r3) {
            if (a2) return a2 = false, r3;
            if (BA(this)) return r3;
            for (var n3 = 0; n3 < o2; n3++) if (e2[n3] === t3) return r3;
          };
        }
      }, qA = St, QA = String, tT = GA("JSON", "stringify"), rT = zA(/./.exec), eT = zA("".charAt), nT = zA("".charCodeAt), iT = zA("".replace), oT = zA(1 .toString), aT = /[\uD800-\uDFFF]/g, uT = /^[\uD800-\uDBFF]$/, sT = /^[\uDC00-\uDFFF]$/, cT = !qA || KA(function() {
        var t2 = GA("Symbol")("stringify detection");
        return "[null]" !== tT([t2]) || "{}" !== tT({ a: t2 }) || "{}" !== tT(Object(t2));
      }), fT = KA(function() {
        return '"\\udf06\\ud834"' !== tT("\uDF06\uD834") || '"\\udead"' !== tT("\uDEAD");
      }), lT = function(t2, r2) {
        var e2 = JA(arguments), n2 = ZA(r2);
        if (HA(n2) || void 0 !== t2 && !XA(t2)) return e2[1] = function(t3, r3) {
          if (HA(n2) && (r3 = $A(n2, this, QA(t3), r3)), !XA(r3)) return r3;
        }, YA(tT, null, e2);
      }, vT = function(t2, r2, e2) {
        var n2 = eT(e2, r2 - 1), i2 = eT(e2, r2 + 1);
        return rT(uT, t2) && !rT(sT, i2) || rT(sT, t2) && !rT(uT, n2) ? "\\u" + oT(nT(t2, 0), 16) : t2;
      };
      tT && WA({ target: "JSON", stat: true, arity: 3, forced: cT || fT }, { stringify: function(t2, r2, e2) {
        var n2 = JA(arguments), i2 = YA(cT ? lT : tT, null, n2);
        return fT && "string" == typeof i2 ? iT(i2, aT, vT) : i2;
      } });
      var hT = $n, dT = rr;
      bi({ target: "Object", stat: true, forced: !St || A(function() {
        hT.f(1);
      }) }, { getOwnPropertySymbols: function(t2) {
        var r2 = hT.f;
        return r2 ? r2(dT(t2)) : [];
      } });
      var gT = bi, pT = T, yT = N, wT = ir, bT = ot, mT = vt, ET = fp, AT = Ca, TT = ei, ST = m.Symbol, IT = ST && ST.prototype;
      if (pT && bT(ST) && (!("description" in IT) || void 0 !== ST().description)) {
        var OT = {}, xT = function() {
          var t2 = arguments.length < 1 || void 0 === arguments[0] ? void 0 : ET(arguments[0]), r2 = mT(IT, this) ? new ST(t2) : void 0 === t2 ? ST() : ST(t2);
          return "" === t2 && (OT[r2] = true), r2;
        };
        TT(xT, ST), xT.prototype = IT, IT.constructor = xT;
        var kT = "Symbol(description detection)" === String(ST("description detection")), PT = yT(IT.valueOf), RT = yT(IT.toString), CT = /^Symbol\((.*)\)[^)]+$/, UT = yT("".replace), LT = yT("".slice);
        AT(IT, "description", { configurable: true, get: function() {
          var t2 = PT(this);
          if (wT(OT, t2)) return "";
          var r2 = RT(t2), e2 = kT ? LT(r2, 7, -1) : UT(r2, CT, "$1");
          return "" === e2 ? void 0 : e2;
        } }), gT({ global: true, constructor: true, forced: true }, { Symbol: xT });
      }
      var MT = ll.every;
      bi({ target: "Array", proto: true, forced: !Mh("every") }, { every: function(t2) {
        return MT(this, t2, arguments.length > 1 ? arguments[1] : void 0);
      } });
      var DT, jT, BT = bi, FT = x, NT = ot, _T = Jr, VT = fp, WT = (DT = false, (jT = /[ac]/).exec = function() {
        return DT = true, /./.exec.apply(this, arguments);
      }, true === jT.test("abc") && DT), GT = /./.test;
      BT({ target: "RegExp", proto: true, forced: !WT }, { test: function(t2) {
        var r2 = _T(this), e2 = VT(t2), n2 = r2.exec;
        if (!NT(n2)) return FT(GT, r2, e2);
        var i2 = FT(n2, r2, e2);
        return null !== i2 && (_T(i2), true);
      } });
      var YT = m, $T = A, zT = fp, KT = lb.trim, HT = nb, XT = N("".charAt), JT = YT.parseFloat, ZT = YT.Symbol, qT = ZT && ZT.iterator, QT = 1 / JT(HT + "-0") != -1 / 0 || qT && !$T(function() {
        JT(Object(qT));
      }) ? function(t2) {
        var r2 = KT(zT(t2)), e2 = JT(r2);
        return 0 === e2 && "-" === XT(r2, 0) ? -0 : e2;
      } : JT;
      bi({ global: true, forced: parseFloat !== QT }, { parseFloat: QT });
      var tS = $r.f, rS = T, eS = m, nS = N, iS = li, oS = ml, aS = fe, uS = pn.f, sS = vt, cS = dp, fS = fp, lS = zw, vS = ty, hS = function(t2, r2, e2) {
        e2 in t2 || tS(t2, e2, { configurable: true, get: function() {
          return r2[e2];
        }, set: function(t3) {
          r2[e2] = t3;
        } });
      }, dS = gn, gS = A, pS = ir, yS = $e.enforce, wS = pl, bS = ny, mS = ay, ES = wr("match"), AS = eS.RegExp, TS = AS.prototype, SS = eS.SyntaxError, IS = nS(TS.exec), OS = nS("".charAt), xS = nS("".replace), kS = nS("".indexOf), PS = nS("".slice), RS = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/, CS = /a/g, US = /a/g, LS = new AS(CS) !== CS, MS = vS.MISSED_STICKY, DS = vS.UNSUPPORTED_Y, jS = rS && (!LS || MS || bS || mS || gS(function() {
        return US[ES] = false, AS(CS) !== CS || AS(US) === US || "/a/i" !== String(AS(CS, "i"));
      }));
      if (iS("RegExp", jS)) {
        for (var BS = function(t2, r2) {
          var e2, n2, i2, o2, a2, u2, s2 = sS(TS, this), c2 = cS(t2), f2 = void 0 === r2, l2 = [], v2 = t2;
          if (!s2 && c2 && f2 && t2.constructor === BS) return t2;
          if ((c2 || sS(TS, t2)) && (t2 = t2.source, f2 && (r2 = lS(v2))), t2 = void 0 === t2 ? "" : fS(t2), r2 = void 0 === r2 ? "" : fS(r2), v2 = t2, bS && "dotAll" in CS && (n2 = !!r2 && kS(r2, "s") > -1) && (r2 = xS(r2, /s/g, "")), e2 = r2, MS && "sticky" in CS && (i2 = !!r2 && kS(r2, "y") > -1) && DS && (r2 = xS(r2, /y/g, "")), mS && (o2 = function(t3) {
            for (var r3, e3 = t3.length, n3 = 0, i3 = "", o3 = [], a3 = {}, u3 = false, s3 = false, c3 = 0, f3 = ""; n3 <= e3; n3++) {
              if ("\\" === (r3 = OS(t3, n3))) r3 += OS(t3, ++n3);
              else if ("]" === r3) u3 = false;
              else if (!u3) switch (true) {
                case "[" === r3:
                  u3 = true;
                  break;
                case "(" === r3:
                  IS(RS, PS(t3, n3 + 1)) && (n3 += 2, s3 = true), i3 += r3, c3++;
                  continue;
                case (">" === r3 && s3):
                  if ("" === f3 || pS(a3, f3)) throw new SS("Invalid capture group name");
                  a3[f3] = true, o3[o3.length] = [f3, c3], s3 = false, f3 = "";
                  continue;
              }
              s3 ? f3 += r3 : i3 += r3;
            }
            return [i3, o3];
          }(t2), t2 = o2[0], l2 = o2[1]), a2 = oS(AS(t2, r2), s2 ? this : TS, BS), (n2 || i2 || l2.length) && (u2 = yS(a2), n2 && (u2.dotAll = true, u2.raw = BS(function(t3) {
            for (var r3, e3 = t3.length, n3 = 0, i3 = "", o3 = false; n3 <= e3; n3++) "\\" !== (r3 = OS(t3, n3)) ? o3 || "." !== r3 ? ("[" === r3 ? o3 = true : "]" === r3 && (o3 = false), i3 += r3) : i3 += "[\\s\\S]" : i3 += r3 + OS(t3, ++n3);
            return i3;
          }(t2), e2)), i2 && (u2.sticky = true), l2.length && (u2.groups = l2)), t2 !== v2) try {
            aS(a2, "source", "" === v2 ? "(?:)" : v2);
          } catch (t3) {
          }
          return a2;
        }, FS = uS(AS), NS = 0; FS.length > NS; ) hS(BS, AS, FS[NS++]);
        TS.constructor = BS, BS.prototype = TS, dS(eS, "RegExp", BS, { constructor: true });
      }
      wS("RegExp");
      var _S = T, VS = ty.MISSED_STICKY, WS = G, GS = Ca, YS = $e.get, $S = RegExp.prototype, zS = TypeError;
      _S && VS && GS($S, "sticky", { configurable: true, get: function() {
        if (this !== $S) {
          if ("RegExp" === WS(this)) return !!YS(this).sticky;
          throw zS("Incompatible receiver, RegExp required");
        }
      } });
      var KS = "(\\d{4})", HS = "(0[1-9]|1[0-2])", XS = "(0[1-9]|1\\d|2\\d|3[0-1])", JS = "(0\\d|1\\d|2\\d|3\\d|4\\d|5\\d)", ZS = JS, qS = new RegExp("^(".concat(KS, "(-").concat(HS, "(-").concat(XS, "(T").concat("(0\\d|1\\d|2[0-3])", "(:").concat(JS, "(:").concat(ZS, ")?)?)?)?)?)$"));
      function QS(t2, r2) {
        for (var e2 = false, n2 = 0; n2 < t2.length && !e2; ) {
          if (tI(t2[n2], r2)) {
            e2 = true;
            break;
          }
          n2++;
        }
        return e2;
      }
      function tI(t2, r2) {
        for (var n2 in t2) {
          if (e(t2[n2]) !== e(r2[n2])) return false;
          switch (e(t2[n2])) {
            case "object":
              if (!tI(t2[n2], r2[n2])) return false;
              break;
            case "function":
              if (void 0 === r2[n2] || t2[n2].toString() !== r2[n2].toString()) return false;
              break;
            default:
              if (t2[n2] !== r2[n2]) return false;
          }
        }
        for (var i2 in r2) if (void 0 === t2[i2]) return false;
        return true;
      }
      function rI(t2, r2) {
        var n2 = {};
        for (var i2 in r2) {
          var o2 = r2[i2], a2 = t2[i2];
          if (void 0 !== a2) if ("object" === e(o2)) n2[i2] = rI(a2, o2);
          else n2[i2] = e(o2) === e(a2) ? a2 : o2;
          else n2[i2] = o2;
        }
        return n2;
      }
      var eI = /^(.*)$/, nI = /^([0-9]+)(\/[0-9]+)?$/, iI = /^(https?):\/\/[^\s/$.?#]+\.[^\s]*/, oI = /^([a-z]{3}|XXX)$/, aI = /(image\/[a-z0-9!#$&.+\-^_]+){0,129}/, uI = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, sI = /^((\[\d{1,}:\d{2}\.\d{3}\]) (.*))/;
      function cI(t2, r2, e2) {
        if ("string" != typeof t2) throw new Error("Value is not a string");
        if (e2 && !t2.match(eI)) throw new Error("Newlines are not allowed");
        return true;
      }
      function fI(t2, r2, e2) {
        return 2 === r2 || 3 === r2 ? t2 = [t2] : 4 === r2 && (t2 = t2.split("\\\\")), t2.forEach(function(t3) {
          if (cI(t3, 0, e2), "string" != typeof t3 && "number" != typeof t3) throw new Error("Value is not a string/number");
          var r3 = t3.match(nI);
          if (e2 && "string" == typeof t3) {
            if (null === r3) throw new Error("Invalid format (eg. 1/2)");
            var n2 = parseInt(r3[1]), i2 = r3[2] ? parseInt(r3[2].substring(1)) : null;
            if (null !== i2 && n2 > i2) throw new Error("Position is greater then total");
          }
        }), true;
      }
      function lI(t2, r2, e2) {
        return 2 === r2 || 3 === r2 ? t2 = [t2] : 4 === r2 && (t2 = t2.split("\\\\")), t2.forEach(function(t3) {
          if (cI(t3, 0, e2), 3 === r2 && e2 && !t3.match(/^(\d{4})$/)) throw new Error("Value is not 4 numeric characters");
          if (4 === r2 && e2 && !t3.match(qS)) throw new Error("Time frames must follow ISO 8601");
        }), true;
      }
      function vI(t2, r2, e2) {
        return 2 === r2 || 3 === r2 ? t2 = [t2] : 4 === r2 && (t2 = t2.split("\\\\")), t2.forEach(function(t3) {
          if (cI(t3, 0, e2), e2 && !t3.match(/^([A-Gb#mo]{1,3})$/)) throw new Error("Invalid TKEY Format (eg Cbm)");
        }), true;
      }
      function hI(t2, r2, e2) {
        return 2 === r2 || 3 === r2 ? t2 = [t2] : 4 === r2 && (t2 = t2.split("\\\\")), t2.forEach(function(t3) {
          if (cI(t3, 0, e2), e2 && !t3.match(oI)) throw new Error("Language must follow ISO 639-2");
        }), true;
      }
      function dI(t2, r2, e2) {
        return 2 === r2 || 3 === r2 ? t2 = [t2] : 4 === r2 && (t2 = t2.split("\\\\")), t2.forEach(function(t3) {
          if (cI(t3, 0, e2), e2 && !t3.match(/^([A-Z0-9]{12})$/)) throw new Error("Invalid ISRC format");
        }), true;
      }
      function gI(t2, r2, e2) {
        if (cI(t2, 0, e2), e2 && !t2.match(iI)) throw new Error("Invalid URL");
        return true;
      }
      function pI(t2, r2, e2) {
        var n2 = [];
        return t2.forEach(function(t3) {
          if (cI(t3.description, 0, e2), cI(t3.text, 0, e2), e2 && QS(n2, t3.description)) throw new Error("Description should not duplicate");
          n2.push(t3.description);
        }), true;
      }
      function yI(t2, r2, e2) {
        var n2 = [];
        return t2.forEach(function(t3) {
          if (cI(t3.description, 0, e2), gI(t3.url, 0, e2), e2 && QS(n2, t3.description)) throw new Error("Description should not duplicate");
          n2.push(t3.description);
        }), true;
      }
      function wI(t2, r2, e2) {
        var n2 = [];
        return t2.forEach(function(t3) {
          if (cI(t3.language, 0, e2), cI(t3.descriptor, 0, e2), "string" != typeof t3.text) throw new Error("Text is not a string");
          if (e2 && !t3.language.match(oI)) throw new Error("Language must follow ISO 639-2");
          var r3 = { language: t3.language, descriptor: t3.descriptor };
          if (e2 && QS(n2, r3)) throw new Error("Language and descriptor should not duplicate");
          n2.push(r3);
        }), true;
      }
      function bI(t2, r2, e2) {
        var n2 = [];
        return t2.forEach(function(t3) {
          if (cI(t3.format, 0, e2), cI(t3.description, 0, e2), "number" != typeof t3.type) throw new Error("Type is not a number");
          if (t3.type > 255 || t3.type < 0) throw new Error("Type should be in range of 0 - 255");
          if (!zp.isViewable(t3.data)) throw new Error("Image data should be viewable");
          if (e2) {
            if (t3.type > 21 || t3.type < 0) throw new Error("Type should be in range of 0 - 21");
            if (!t3.format.match(aI)) throw new Error("Format should be an image MIME");
            if (t3.description.length > 64) throw new Error("Description should not exceed 64");
            if (QS(n2, t3.description)) throw new Error("Description should not duplicate");
            n2.push(t3.description);
          }
        }), true;
      }
      function mI(t2, r2, e2) {
        var n2 = [];
        return t2.forEach(function(t3) {
          if (cI(t3.format, 0, e2), cI(t3.filename, 0, e2), cI(t3.description, 0, e2), !zp.isViewable(t3.object)) throw new Error("Object data should be viewable");
          if (e2 && QS(n2, t3.description)) throw new Error("GEOB description should not duplicate");
          n2.push(t3.description);
        }), true;
      }
      function EI(t2, r2, e2, n2) {
        for (var i2 = 0; i2 < r2.length; i2++) {
          var o2 = r2[i2], a2 = t2[o2];
          if (a2) {
            if (!zp.isViewable(a2)) throw new Error("".concat(n2, ".").concat(o2, " must be viewable"));
            if (new zp(a2).byteLength > e2) throw new Error("".concat(n2, ".").concat(o2, " exceeds bits limit"));
          }
        }
      }
      function AI(t2, r2, n2) {
        if ("object" !== e(t2)) throw new Error("Values must be an object");
        var i2 = t2.volumechange, o2 = t2.peakvolume, a2 = t2.bitsvolume || 16, u2 = Math.ceil(a2 / 8);
        if (a2 && (a2 < 0 || a2 > 255)) throw new Error("Bits volume should be in the range of 0 - 255");
        if (n2 && 0 === a2) throw new Error("Bits used for volume description may not be 0");
        var s2 = ["right", "left", "rightback", "leftback", "center", "bass"];
        return i2 && EI(i2, s2, u2, "volumechange"), o2 && EI(o2, s2, u2, "peakvolume"), true;
      }
      function TI(t2, r2, e2) {
        var n2 = [];
        return t2.forEach(function(t3) {
          var r3 = t3.language, i2 = t3.descriptor, o2 = t3.type, a2 = t3.format, u2 = t3.lyrics, s2 = t3.data;
          if (cI(r3, 0, e2), cI(i2, 0, e2), u2 && "string" != typeof u2) throw new Error("Lyrics is not a string");
          if (s2) {
            var c2, f2 = p(s2);
            try {
              for (f2.s(); !(c2 = f2.n()).done; ) {
                var l2 = c2.value, v2 = l2.time;
                if ("string" != typeof l2.line) throw new Error("Line is not a string");
                if ("number" != typeof v2) throw new Error("Timestamp is not a number");
              }
            } catch (t4) {
              f2.e(t4);
            } finally {
              f2.f();
            }
          }
          if ("number" != typeof o2) throw new Error("Type is not a number");
          if (o2 > 255 || o2 < 0) throw new Error("Type should be in range of 0 - 255");
          if ("number" != typeof a2) throw new Error("Format is not a number");
          if (a2 > 255 || a2 < 0) throw new Error("Format should be in range of 0 - 255");
          if (e2) {
            if (!r3.match(oI)) throw new Error("Language must follow ISO 639-2");
            if (o2 > 6 || o2 < 0) throw new Error("Type should be in range of 0 - 8");
            if (a2 > 2 || a2 < 1) throw new Error("Format should be either 1 or 2");
            if (u2 && !u2.split("\n").every(function(t4) {
              return !t4.length || sI.test(t4);
            })) throw new Error("Lyrics must follow this format: [mm:ss.xxx]");
            var h2 = { language: r3, descriptor: i2 };
            if (QS(n2, h2)) throw new Error("1 SYLT with same language and descriptor only");
            n2.push(h2);
          }
        }), true;
      }
      function SI(t2, r2, e2) {
        if (!zp.isViewable(t2.data)) throw new Error("Data should be viewable");
        return true;
      }
      function II(t2, r2, e2) {
        if ("number" != typeof t2.format) throw new Error("Timestamp format is not a number");
        if (t2.format > 255 || t2.format < 0) throw new Error("Timestamp format should be in range of 0 - 255");
        if (e2 && (t2.format > 2 || t2.format < 1)) throw new Error("Invalid timestamp format (should be 1 or 2)");
        var n2, i2 = p(t2.data);
        try {
          for (i2.s(); !(n2 = i2.n()).done; ) {
            var o2 = n2.value, a2 = o2.bpm, u2 = o2.time;
            if ("number" != typeof a2) throw new Error("BPM is not a number");
            if (a2 > 510 || a2 < 0) throw new Error("BPM should be in range of 0 - 510");
            if ("number" != typeof u2) throw new Error("Timestamp is not a number");
          }
        } catch (t3) {
          i2.e(t3);
        } finally {
          i2.f();
        }
        return true;
      }
      function OI(t2, r2, e2) {
        if ("number" != typeof t2.format) throw new Error("Format is not a number");
        if (t2.format > 255 || t2.format < 0) throw new Error("Format should be in range of 0 - 255");
        if (e2 && (t2.format > 2 || t2.format < 1)) throw new Error("Invalid timestamp format (should be 1 or 2)");
        var n2, i2 = p(t2.data);
        try {
          for (i2.s(); !(n2 = i2.n()).done; ) {
            var o2 = n2.value, a2 = o2.event, u2 = o2.time;
            if ("number" != typeof a2) throw new Error("Event is not a number");
            if (a2 > 255 || a2 < 0) throw new Error("Event should be in range of 0 - 255");
            if ("number" != typeof u2) throw new Error("Timestamp is not a number");
          }
        } catch (t3) {
          i2.e(t3);
        } finally {
          i2.f();
        }
        return true;
      }
      function xI(t2, r2, e2) {
        if (isNaN(t2) || isNaN(parseFloat(t2))) throw new Error("Value is not numerical");
        return true;
      }
      function kI(t2, r2, e2) {
        var n2 = [];
        return t2.forEach(function(t3) {
          var r3 = t3.email, i2 = t3.rating, o2 = t3.counter;
          if (cI(r3, 0, e2), "number" != typeof i2) throw new Error("Rating is not a number");
          if (i2 > 255 || i2 < 0) throw new Error("Rating should be in range of 0 - 255");
          if ("number" != typeof o2) throw new Error("Counter is not a number");
          if (e2) {
            if (!r3.match(uI)) throw new Error("Email is not a valid email");
            var a2 = { email: r3 };
            if (QS(n2, a2)) throw new Error("1 POPM with same email only");
            n2.push(a2);
          }
        }), true;
      }
      Ev("Int16", function(t2) {
        return function(r2, e2, n2) {
          return t2(this, r2, e2, n2);
        };
      });
      var PI = Mi, RI = Rn, CI = zg, UI = wf, LI = function(t2, r2, e2, n2, i2, o2, a2, u2) {
        for (var s2, c2, f2 = i2, l2 = 0, v2 = !!a2 && UI(a2, u2); l2 < n2; ) l2 in e2 && (s2 = v2 ? v2(e2[l2], l2, r2) : e2[l2], o2 > 0 && PI(s2) ? (c2 = RI(s2), f2 = LI(t2, r2, s2, c2, f2, o2 - 1) - 1) : (CI(f2 + 1), t2[f2] = s2), f2++), l2++;
        return f2;
      }, MI = LI, DI = jt, jI = rr, BI = Rn, FI = nl;
      function NI(t2, r2, e2, n2) {
        var i2 = Yp(t2), o2 = new zp(2 === e2 ? 3 : 4);
        2 === e2 ? o2.setUint24(0, r2) : o2.setUint32(0, 3 === e2 ? r2 : Mb(r2));
        var a2 = [];
        return 3 !== e2 && 4 !== e2 || (a2.push(0, 0), 4 === e2 && n2.unsynchronisation && (a2[1] = Ub(a2[1], 1)), 4 === e2 && n2.dataLengthIndicator && (a2[1] = Ub(a2[1], 0))), Db(i2, o2.getUint8(0, 2 === e2 ? 3 : 4), a2);
      }
      function _I(t2, r2) {
        var e2 = new zp(4), n2 = function(t3) {
          for (var r3 = [], e3 = 0; e3 < t3.length; ) r3.push(t3[e3]), 255 === t3[e3] && (t3[e3 + 1] >= 224 || 0 === t3[e3 + 1]) && r3.push(0), e3++;
          return r3;
        }(t2), i2 = [];
        return 4 === r2 && (e2.setUint32(0, Mb(t2.length)), i2.push.apply(i2, h(e2.getUint8(0, 4)))), n2.forEach(function(t3) {
          return i2.push(t3);
        }), new Uint8Array(i2);
      }
      function VI(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = r2.encoding, a2 = r2.encodingIndex, u2 = [];
        switch (n2) {
          case 2:
          case 3:
            u2 = Yp(t2.replace(/\\\\/g, "/") + "\0", o2);
            break;
          case 4:
            u2 = Yp(t2.replace(/\\\\/g, "\0") + "\0", o2);
        }
        var s2 = Db(a2, u2);
        return i2 && (s2 = _I(s2, n2)), Db(NI(e2, s2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), s2);
      }
      function WI(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = [];
        switch (n2) {
          case 2:
          case 3:
            o2 = Yp(t2.replace(/\\\\/g, "/") + "\0");
            break;
          case 4:
            o2 = Yp(t2.replace(/\\\\/g, "\0") + "\0");
        }
        var a2 = Db(0, o2);
        return i2 && (a2 = _I(a2, n2)), Db(NI(e2, a2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), a2);
      }
      function GI(t2, r2) {
        var e2 = r2.version;
        return 2 === e2 || 3 === e2 ? t2 = t2.toString().split("\\\\")[0] : 4 === e2 && (t2 = t2.toString().replace(/\\\\/g, "\0")), WI(t2, r2);
      }
      function YI(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = Yp(t2 + "\0");
        return i2 && (o2 = _I(o2, n2)), Db(NI(e2, o2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), o2);
      }
      function $I(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = r2.encoding, a2 = r2.encodingIndex, u2 = [];
        return t2.forEach(function(t3) {
          var r3 = Yp(t3.description + "\0", o2), s2 = Yp(t3.text + "\0", o2), c2 = Db(a2, r3, s2);
          i2 && (c2 = _I(c2, n2)), Db(NI(e2, c2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), c2).forEach(function(t4) {
            return u2.push(t4);
          });
        }), u2;
      }
      function zI(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = r2.encoding, a2 = r2.encodingIndex, u2 = [];
        return t2.forEach(function(t3) {
          var r3 = Yp(t3.description + "\0", o2), s2 = Yp(t3.url + "\0"), c2 = Db(a2, r3, s2);
          i2 && (c2 = _I(c2, n2)), Db(NI(e2, c2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), c2).forEach(function(t4) {
            return u2.push(t4);
          });
        }), u2;
      }
      function KI(t2, r2) {
        return r2.version = 4, VI(t2, r2);
      }
      function HI(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = r2.encoding, a2 = r2.encodingIndex, u2 = [];
        return t2.forEach(function(t3) {
          var r3 = Yp(t3.language), s2 = Yp(t3.descriptor + "\0", o2), c2 = Yp(t3.text + "\0", o2), f2 = Db(a2, r3, s2, c2);
          i2 && (f2 = _I(f2, n2)), Db(NI(e2, f2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), f2).forEach(function(t4) {
            return u2.push(t4);
          });
        }), u2;
      }
      function XI(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = r2.encoding, a2 = r2.encodingIndex, u2 = [];
        return t2.forEach(function(t3) {
          var r3 = Yp(t3.format + "\0"), s2 = new Uint8Array(t3.data), c2 = Yp(t3.description + "\0", o2), f2 = Db(a2, r3, t3.type, c2, s2);
          i2 && (f2 = _I(f2, n2)), Db(NI(e2, f2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), f2).forEach(function(t4) {
            return u2.push(t4);
          });
        }), u2;
      }
      function JI(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = r2.encoding, a2 = r2.encodingIndex, u2 = [];
        return t2.forEach(function(t3) {
          var r3 = Yp(t3.format + "\0"), s2 = new Uint8Array(t3.object), c2 = Yp(t3.filename + "\0", o2), f2 = Yp(t3.description + "\0", o2), l2 = Db(a2, r3, c2, f2, s2);
          i2 && (l2 = _I(l2, n2)), Db(NI(e2, l2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), l2).forEach(function(t4) {
            return u2.push(t4);
          });
        }), u2;
      }
      function ZI(t2, r2) {
        var n2 = r2.id, i2 = r2.version, o2 = r2.unsynch, a2 = [], u2 = t2.bitsvolume || 16, s2 = Math.ceil(u2 / 8), c2 = 0;
        t2.incdec && (t2.incdec.right && (c2 = Ub(c2, 0)), t2.incdec.left && (c2 = Ub(c2, 1)), t2.incdec.rightback && (c2 = Ub(c2, 2)), t2.incdec.leftback && (c2 = Ub(c2, 3)), t2.incdec.center && (c2 = Ub(c2, 4)), t2.incdec.bass && (c2 = Ub(c2, 5))), a2.push(c2), a2.push(u2);
        var f2 = "object" === e(t2.volumechange) ? t2.volumechange : {}, l2 = "object" === e(t2.peakvolume) ? t2.peakvolume : {}, v2 = jb(f2.right, s2), h2 = jb(f2.left, s2), d2 = jb(l2.right, s2), g2 = jb(l2.left, s2);
        if (v2.forEach(function(t3) {
          return a2.push(t3);
        }), h2.forEach(function(t3) {
          return a2.push(t3);
        }), d2.forEach(function(t3) {
          return a2.push(t3);
        }), g2.forEach(function(t3) {
          return a2.push(t3);
        }), Array.isArray(f2.rightback) && f2.rightback.length > 0 || Array.isArray(f2.leftback) && f2.leftback.length > 0 || Array.isArray(l2.rightback) && l2.rightback.length > 0 || Array.isArray(l2.leftback) && l2.leftback.length > 0) {
          var p2 = jb(f2.rightback, s2), y2 = jb(f2.leftback, s2), w2 = jb(l2.rightback, s2), b2 = jb(l2.leftback, s2);
          p2.forEach(function(t3) {
            return a2.push(t3);
          }), y2.forEach(function(t3) {
            return a2.push(t3);
          }), w2.forEach(function(t3) {
            return a2.push(t3);
          }), b2.forEach(function(t3) {
            return a2.push(t3);
          });
        }
        if (Array.isArray(f2.center) && f2.center.length > 0 || Array.isArray(l2.center) && l2.center.length > 0) {
          var m2 = jb(f2.center, s2), E2 = jb(l2.center, s2);
          m2.forEach(function(t3) {
            return a2.push(t3);
          }), E2.forEach(function(t3) {
            return a2.push(t3);
          });
        }
        if (Array.isArray(f2.bass) && f2.bass.length > 0 || Array.isArray(l2.bass) && l2.bass.length > 0) {
          var A2 = jb(f2.bass, s2), T2 = jb(l2.bass, s2);
          A2.forEach(function(t3) {
            return a2.push(t3);
          }), T2.forEach(function(t3) {
            return a2.push(t3);
          });
        }
        var S2 = o2 ? _I(a2) : a2;
        return Db(NI(n2, S2.length, i2, { unsynchronisation: o2, dataLengthIndicator: o2 }), S2);
      }
      function qI(t2) {
        var r2 = new zp(4);
        return r2.setUint32(0, t2), r2.getUint8(0, 4);
      }
      function QI(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = r2.encoding, a2 = r2.encodingIndex, u2 = [];
        return t2.forEach(function(t3) {
          var r3, s2, c2, f2, l2 = Yp(t3.language), v2 = Yp(t3.descriptor + "\0", o2), h2 = [];
          t3.data ? t3.data.forEach(function(t4) {
            var r4 = t4.time, e3 = Yp(t4.line + "\0", o2);
            h2 = Db(h2, e3, qI(r4));
          }) : t3.lyrics && (r3 = t3.lyrics, s2 = o2, c2 = /^\[(\d{1,}):(\d{2})\.(\d{3})\] ?(.*)/, f2 = [], r3.replace(/\r\n/g, "\n").split("\n").forEach(function(t4) {
            if ("" !== t4) {
              var r4 = c2.exec(t4), e3 = 6e4 * parseInt(r4[1]) + 1e3 * parseInt(r4[2]) + parseInt(r4[3]), n3 = Yp((r4[4] || "") + "\0", s2);
              f2 = Db(f2, n3, qI(e3));
            }
          }), h2 = f2);
          var d2 = Db(a2, l2, t3.format, t3.type, v2, h2);
          i2 && (d2 = _I(d2, n2)), Db(NI(e2, d2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), d2).forEach(function(t4) {
            return u2.push(t4);
          });
        }), u2;
      }
      function tO(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch;
        return i2 && (t2.data = _I(t2.data, n2)), Db(NI(e2, t2.data.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), t2.data);
      }
      function rO(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = t2.data.flatMap(function(t3) {
          var r3 = t3.bpm, e3 = t3.time;
          return r3 >= 255 ? [255, r3 - 255].concat(h(qI(e3))) : [r3].concat(h(qI(e3)));
        }), a2 = Db(t2.format, o2);
        return i2 && (a2 = _I(a2, n2)), Db(NI(e2, a2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), a2);
      }
      function eO(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = t2.data.flatMap(function(t3) {
          var r3 = t3.event, e3 = t3.time;
          return [r3].concat(h(qI(e3)));
        }), a2 = Db(t2.format, o2);
        return i2 && (a2 = _I(a2, n2)), Db(NI(e2, a2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), a2);
      }
      function nO(t2, r2) {
        for (var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = Fb(parseInt(t2)); o2.length < 4; ) o2.unshift(0);
        return i2 && (o2 = _I(o2, n2)), Db(NI(e2, o2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), o2);
      }
      function iO(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = [];
        return t2.forEach(function(t3) {
          for (var r3 = Yp(t3.email + "\0"), a2 = Fb(t3.counter); a2.length < 4; ) a2.unshift(0);
          var u2 = Db(r3, t3.rating, a2);
          i2 && (u2 = _I(u2, n2)), Db(NI(e2, u2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), u2).forEach(function(t4) {
            return o2.push(t4);
          });
        }), o2;
      }
      bi({ target: "Array", proto: true }, { flatMap: function(t2) {
        var r2, e2 = jI(this), n2 = BI(e2);
        return DI(t2), (r2 = FI(e2, 0)).length = MI(r2, e2, e2, n2, 0, 1, t2, arguments.length > 1 ? arguments[1] : void 0), r2;
      } }), oo("flatMap");
      var oO = { parse: Lm, validate: bI, write: XI, version: [3, 4] }, aO = { parse: Cm, validate: wI, write: HI, version: [3, 4] }, uO = { parse: _m, validate: OI, write: eO, version: [3, 4] }, sO = { parse: Mm, validate: mI, write: JI, version: [3, 4] }, cO = { parse: xm, validate: cI, write: KI, version: [3] }, fO = { parse: Fm, validate: SI, write: tO, version: [3, 4] }, lO = { parse: function(t2, r2) {
        var e2 = new zp(t2), n2 = Gp[e2.getUint8(0)], i2 = e2.getString(1, 3), o2 = e2.getCString(4), a2 = e2.getString(o2.length + 4, 8), u2 = o2.length + a2.length + 4, s2 = e2.byteLength - u2, c2 = e2.getString(u2, s2, n2);
        return { currencyCode: i2.string, currencyPrice: o2.string, date: a2.string, seller: c2.string };
      }, validate: function(t2, r2, e2) {
        if (cI(t2.date, 0, e2), cI(t2.seller, 0, e2), cI(t2.currencyCode, 0, e2), cI(t2.currencyPrice, 0, e2), e2) {
          if (!t2.date.match("".concat(KS).concat(HS).concat(XS))) throw new Error("Date is not valid (format: YYYYMMDD)");
          if (!t2.currencyCode.match(/^([A-Z]{3})$/)) throw new Error("Currency code is not valid (eg. USD)");
          if (!t2.currencyPrice.match(/^(\d*)\.(\d+)$/)) throw new Error("Currency price is not valid (eg. 2.00)");
        }
        return true;
      }, write: function(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = r2.encoding, a2 = Db(r2.encodingIndex, Yp(t2.currencyCode), Yp(t2.currencyPrice + "\0"), Yp(t2.date), Yp(t2.seller, o2));
        return i2 && (a2 = _I(a2, n2)), Db(NI(e2, a2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), a2);
      }, version: [3, 4] }, vO = { parse: Vm, validate: xI, write: nO, version: [3, 4] }, hO = { parse: Wm, validate: kI, write: iO, version: [3, 4] }, dO = { parse: function(t2, r2) {
        var e2 = new zp(t2), n2 = e2.getCString(0), i2 = e2.getUint8(n2.length, e2.byteLength - n2.length), o2 = Array.isArray(i2) ? i2 : [i2];
        return { ownerId: n2.string, data: o2 };
      }, validate: function(t2, r2, e2) {
        var n2 = [];
        return t2.forEach(function(t3) {
          if (cI(t3.ownerId, 0, e2), !zp.isViewable(t3.data)) throw new Error("Data should be viewable");
          if (e2 && QS(n2, t3.data)) throw new Error("Data should not duplicate");
          n2.push(t3.data);
        }), true;
      }, write: function(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = [];
        return t2.forEach(function(t3) {
          var r3 = Db(Yp(t3.ownerId), new Uint8Array(t3.data));
          i2 && (r3 = _I(r3, n2)), Db(NI(e2, r3.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), r3).forEach(function(t4) {
            return o2.push(t4);
          });
        }), o2;
      }, version: [3, 4] }, gO = { parse: Dm, validate: AI, write: ZI, version: [3] }, pO = { parse: function(t2, r2) {
        for (var e2 = new zp(t2), n2 = e2.getCString(0), i2 = [], o2 = n2.length; o2 < e2.byteLength; ) {
          var a2 = e2.getUint8(o2), u2 = e2.getInt16(o2 + 1, true), s2 = e2.getUint8(o2 + 3), c2 = Math.ceil(s2 / 8), f2 = e2.getUint8(o2 + 4, c2);
          i2.push({ type: a2, volumeadjust: u2, bitspeak: s2, peakvolume: Array.isArray(f2) ? f2 : [f2] }), o2 += 4 + c2;
        }
        return { identification: n2.string, channels: i2 };
      }, validate: function(t2, r2, e2) {
        var n2 = [];
        t2.forEach(function(t3) {
          if (!Array.isArray(t3.channels)) throw new Error("Channels should be an array");
          for (var r3 = 0; r3 < t3.channels.length; r3++) {
            var i2 = t3.channels[r3];
            if ("number" != typeof i2.type) throw new Error("Type of channel should be a number");
            if (e2 && (i2.type < 0 || i2.type > 8)) throw new Error("Type of channel should be in the range of 0 - 8");
            if ("number" != typeof i2.volumeadjust) throw new Error("Volume adjustment should be a number");
            if ("number" != typeof i2.bitspeak) throw new Error("Bits representing peak should be a number");
            if (i2.bitspeak < 0 || i2.bitspeak > 255) throw new Error("Bits representing peak should be in range of 0 - 255");
            if (!zp.isViewable(i2.peakvolume)) throw new Error("Peak volume must be viewable");
            if (new zp(i2.peakvolume).byteLength > Math.ceil(i2.bitspeak / 8)) throw new Error("Peak volume exceeds bits limit");
          }
          var o2 = { identification: t3.identification };
          if (e2 && QS(n2, o2)) throw new Error("RVA2 identification should be unique");
          n2.push(o2);
        });
      }, write: function(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = [];
        return t2.forEach(function(t3) {
          for (var r3 = Yp(t3.identification + "\0"), a2 = 0; a2 < t3.channels.length; a2++) {
            var u2 = t3.channels[a2], s2 = u2.type, c2 = new Int16Array([u2.volumeadjust]), f2 = new Uint8Array(c2.buffer), l2 = u2.bitspeak, v2 = Math.ceil(l2 / 8);
            r3 = Db(r3, s2, f2, l2, jb(u2.peakvolume, v2));
          }
          Db(NI(e2, r3.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), r3).forEach(function(t4) {
            return o2.push(t4);
          });
        }), o2;
      }, version: [4] }, yO = { parse: function(t2, r2) {
        return new zp(t2).getUint32(0);
      } }, wO = { parse: function(t2, r2) {
        var e2 = new zp(t2), n2 = e2.getUint8(1, e2.byteLength - 1), i2 = Array.isArray(n2) ? n2 : [n2];
        return { group: e2.getUint8(0), signature: i2 };
      }, validate: function(t2, r2, e2) {
        var n2 = [];
        return t2.forEach(function(t3) {
          if ("number" != typeof t3.group) throw new Error("Group ID is not a number");
          if (t3.group < 0 || t3.group > 255) throw new Error("Group ID should be in the range of 0 - 255");
          if (!zp.isViewable(t3.signature)) throw new Error("Signature should be viewable");
          if (e2 && QS(n2, t3)) throw new Error("SIGN contents should not be identical to others");
          n2.push(t3);
        }), true;
      }, write: function(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = [];
        return t2.forEach(function(t3) {
          var r3 = new Uint8Array(t3.signature), a2 = Db(t3.group, r3);
          i2 && (a2 = _I(a2, n2)), Db(NI(e2, a2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), a2).forEach(function(t4) {
            return o2.push(t4);
          });
        }), o2;
      }, version: [4] }, bO = { parse: Bm, validate: TI, write: QI, version: [3, 4] }, mO = { parse: Nm, validate: II, write: rO, version: [3, 4] }, EO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, AO = { parse: Im, validate: cI, write: WI, version: [3, 4] }, TO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, SO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, IO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, OO = { parse: Im, validate: lI, write: WI, version: [3] }, xO = { parse: Im, validate: lI, write: WI, version: [4] }, kO = { parse: Im, validate: cI, write: WI, version: [3] }, PO = { parse: Im, validate: lI, write: WI, version: [4] }, RO = { parse: Im, validate: lI, write: WI, version: [4] }, CO = { parse: Im, validate: lI, write: WI, version: [4] }, UO = { parse: Im, validate: lI, write: WI, version: [4] }, LO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, MO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, DO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, jO = { parse: Im, validate: lI, write: WI, version: [3] }, BO = { parse: Im, validate: cI, write: VI, version: [4] }, FO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, NO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, _O = { parse: Im, validate: cI, write: VI, version: [3, 4] }, VO = { parse: Im, validate: vI, write: WI, version: [3, 4] }, WO = { parse: Im, validate: hI, write: WI, version: [3, 4] }, GO = { parse: Im, validate: cI, write: WI, version: [3, 4] }, YO = { parse: Im, validate: cI, write: VI, version: [4] }, $O = { parse: Im, validate: cI, write: VI, version: [3, 4] }, zO = { parse: Im, validate: cI, write: VI, version: [4] }, KO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, HO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, XO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, JO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, ZO = { parse: Im, validate: lI, write: WI, version: [3] }, qO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, QO = { parse: Im, validate: cI, write: VI, version: [3, 4] }, tx = { parse: Im, validate: cI, write: VI, version: [3, 4] }, rx = { parse: Im, validate: cI, write: VI, version: [3, 4] }, ex = { parse: Im, validate: cI, write: VI, version: [3, 4] }, nx = { parse: Om, validate: fI, write: GI, version: [3, 4] }, ix = { parse: Im, validate: cI, write: VI, version: [4] }, ox = { parse: Im, validate: cI, write: VI, version: [3, 4] }, ax = { parse: Om, validate: fI, write: GI, version: [3, 4] }, ux = { parse: Im, validate: cI, write: VI, version: [3] }, sx = { parse: Im, validate: cI, write: VI, version: [3, 4] }, cx = { parse: Im, validate: cI, write: VI, version: [3, 4] }, fx = { parse: Im, validate: cI, write: WI, version: [3] }, lx = { parse: Im, validate: cI, write: VI, version: [4] }, vx = { parse: Im, validate: cI, write: VI, version: [4] }, hx = { parse: Im, validate: cI, write: VI, version: [4] }, dx = { parse: Im, validate: cI, write: VI, version: [4] }, gx = { parse: Im, validate: dI, write: WI, version: [3, 4] }, px = { parse: Im, validate: cI, write: VI, version: [3, 4] }, yx = { parse: Im, validate: cI, write: VI, version: [4] }, wx = { parse: Im, validate: lI, write: WI, version: [3] }, bx = { parse: Pm, validate: pI, write: $I, version: [3, 4] }, mx = { parse: function(t2, r2) {
        var e2 = new zp(t2), n2 = e2.getCString(0), i2 = e2.getUint8(n2.length, e2.byteLength - n2.length), o2 = Array.isArray(i2) ? i2 : [i2];
        return { ownerId: n2.string, id: o2 };
      }, validate: function(t2, r2, e2) {
        var n2 = [];
        return t2.forEach(function(t3) {
          if (cI(t3.ownerId, 0, e2), !zp.isViewable(t3.id)) throw new Error("ID should be viewable");
          if (e2) {
            if ("" === t3.ownerId) throw new Error("ownerId should not be blank");
            if ((t3.id.byteLength || t3.id.length || 0) > 64) throw new Error("ID bytelength should not exceed 64 bytes");
            if (QS(n2, t3.ownerId)) throw new Error("ownerId should not duplicate");
            n2.push(t3.ownerId);
          }
        }), true;
      }, write: function(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = [];
        return t2.forEach(function(t3) {
          var r3 = Db(Yp(t3.ownerId + "\0"), new Uint8Array(t3.id));
          i2 && (r3 = _I(r3, n2)), Db(NI(e2, r3.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), r3).forEach(function(t4) {
            return o2.push(t4);
          });
        }), o2;
      }, version: [3, 4] }, Ex = { parse: function(t2, r2) {
        var e2 = new zp(t2), n2 = Gp[e2.getUint8(0)];
        return { language: e2.getString(1, 3).string, text: e2.getString(4, e2.byteLength - 4, n2).string };
      }, validate: function(t2, r2, e2) {
        return t2.forEach(function(t3) {
          if (cI(t3.language, 0, e2), "string" != typeof t3.text) throw new Error("Text is not a string");
          if (e2 && !t3.language.match(oI)) throw new Error("Language must follow ISO 639-2");
        }), true;
      }, write: function(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = r2.encoding, a2 = r2.encodingIndex, u2 = [], s2 = Db(a2, Yp(t2.language), Yp(t2.text + "\0", o2));
        return i2 && (s2 = _I(s2, n2)), Db(NI(e2, s2.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), s2).forEach(function(t3) {
          return u2.push(t3);
        }), u2;
      }, version: [3, 4] }, Ax = { parse: Cm, validate: wI, write: HI, version: [3, 4] }, Tx = { parse: km, validate: gI, write: YI, version: [3, 4] }, Sx = { parse: km, validate: gI, write: YI, version: [3, 4] }, Ix = { parse: km, validate: gI, write: YI, version: [3, 4] }, Ox = { parse: km, validate: gI, write: YI, version: [3, 4] }, xx = { parse: km, validate: gI, write: YI, version: [3, 4] }, kx = { parse: km, validate: gI, write: YI, version: [3, 4] }, Px = { parse: km, validate: gI, write: YI, version: [3, 4] }, Rx = { parse: km, validate: gI, write: YI, version: [3, 4] }, Cx = { parse: Rm, validate: yI, write: zI, version: [3, 4] }, Ux = { parse: Um, validate: gI, write: WI, version: [3, 4] }, Lx = { parse: Im, validate: cI, write: VI, version: [3, 4] }, Mx = { parse: Um, validate: gI, write: WI, version: [3, 4] }, Dx = { parse: Im, validate: cI, write: VI, version: [3, 4] }, jx = { parse: Im, validate: cI, write: VI, version: [2] }, Bx = { parse: Im, validate: cI, write: VI, version: [2] }, Fx = { parse: Im, validate: cI, write: VI, version: [2] }, Nx = { parse: Im, validate: cI, write: VI, version: [2] }, _x = { parse: Im, validate: cI, write: VI, version: [2] }, Vx = { parse: Im, validate: cI, write: VI, version: [2] }, Wx = { parse: Im, validate: cI, write: VI, version: [2] }, Gx = { parse: Im, validate: cI, write: VI, version: [2] }, Yx = { parse: Im, validate: cI, write: VI, version: [2] }, $x = { parse: Im, validate: hI, write: WI, version: [2] }, zx = { parse: Im, validate: cI, write: VI, version: [2] }, Kx = { parse: Im, validate: cI, write: VI, version: [2] }, Hx = { parse: Om, validate: fI, write: GI, version: [2] }, Xx = { parse: Om, validate: fI, write: GI, version: [2] }, Jx = { parse: Im, validate: dI, write: WI, version: [2] }, Zx = { parse: Im, validate: lI, write: WI, version: [2] }, qx = { parse: Im, validate: lI, write: WI, version: [2] }, Qx = { parse: Im, validate: lI, write: WI, version: [2] }, tk = { parse: Im, validate: cI, write: WI, version: [2] }, rk = { parse: Im, validate: cI, write: VI, version: [2] }, ek = { parse: Im, validate: cI, write: VI, version: [2] }, nk = { parse: Im, validate: cI, write: WI, version: [2] }, ik = { parse: Im, validate: cI, write: VI, version: [2] }, ok = { parse: Im, validate: cI, write: VI, version: [2] }, ak = { parse: Im, validate: cI, write: VI, version: [2] }, uk = { parse: Im, validate: cI, write: VI, version: [2] }, sk = { parse: Im, validate: cI, write: VI, version: [2] }, ck = { parse: Im, validate: cI, write: WI, version: [2] }, fk = { parse: Im, validate: cI, write: WI, version: [2] }, lk = { parse: Im, validate: cI, write: WI, version: [2] }, vk = { parse: Im, validate: vI, write: WI, version: [2] }, hk = { parse: Im, validate: cI, write: VI, version: [2] }, dk = { parse: Im, validate: cI, write: VI, version: [2] }, gk = { parse: Im, validate: cI, write: WI, version: [2] }, pk = { parse: Pm, validate: pI, write: $I, version: [2] }, yk = { parse: km, validate: gI, write: YI, version: [2] }, wk = { parse: km, validate: gI, write: YI, version: [2] }, bk = { parse: km, validate: gI, write: YI, version: [2] }, mk = { parse: km, validate: gI, write: YI, version: [2] }, Ek = { parse: km, validate: gI, write: YI, version: [2] }, Ak = { parse: km, validate: gI, write: YI, version: [2] }, Tk = { parse: Rm, validate: yI, write: zI, version: [2] }, Sk = { parse: xm, validate: cI, write: KI, version: [2] }, Ik = { parse: Fm, validate: SI, write: tO, version: [2] }, Ok = { parse: _m, validate: OI, write: eO, version: [2] }, xk = { parse: Nm, validate: II, write: rO, version: [2] }, kk = { parse: Cm, validate: wI, write: HI, version: [2] }, Pk = { parse: Bm, validate: TI, write: QI, version: [2] }, Rk = { parse: Cm, validate: wI, write: HI, version: [2] }, Ck = { parse: Dm, validate: AI, write: ZI, version: [2] }, Uk = { parse: Lm, validate: bI, write: XI, version: [2] }, Lk = { parse: Mm, validate: mI, write: JI, version: [2] }, Mk = { parse: Vm, validate: xI, write: nO, version: [2] }, Dk = { parse: Wm, validate: kI, write: iO, version: [2] }, jk = { parse: Im, validate: cI, write: VI, version: [2] }, Bk = { parse: Im, validate: cI, write: VI, version: [2] }, Fk = { validate: function(t2, r2, e2) {
        return t2.forEach(function(t3) {
          if (!Array.isArray(t3)) throw new Error("Unsupported frame is not an array");
        }), true;
      }, write: function(t2, r2) {
        var e2 = r2.id, n2 = r2.version, i2 = r2.unsynch, o2 = [];
        return t2.forEach(function(t3) {
          Db(NI(e2, t3.length, n2, { unsynchronisation: i2, dataLengthIndicator: i2 }), t3).forEach(function(t4) {
            return o2.push(t4);
          });
        }), o2;
      } }, Nk = Object.freeze({ __proto__: null, APIC: oO, COMM: aO, ETCO: uO, GEOB: sO, IPLS: cO, MCDI: fO, OWNE: lO, PCNT: vO, POPM: hO, PRIV: dO, RVAD: gO, RVA2: pO, SEEK: yO, SIGN: wO, SYLT: bO, SYTC: mO, TALB: EO, TBPM: AO, TCOM: TO, TCON: SO, TCOP: IO, TDAT: OO, TDEN: xO, TDLY: kO, TDOR: PO, TDRC: RO, TDRL: CO, TDTG: UO, TENC: LO, TEXT: MO, TFLT: DO, TIME: jO, TIPL: BO, TIT1: FO, TIT2: NO, TIT3: _O, TKEY: VO, TLAN: WO, TLEN: GO, TMCL: YO, TMED: $O, TMOO: zO, TOAL: KO, TOFN: HO, TOLY: XO, TOPE: JO, TORY: ZO, TOWN: qO, TPE1: QO, TPE2: tx, TPE3: rx, TPE4: ex, TPOS: nx, TPRO: ix, TPUB: ox, TRCK: ax, TRDA: ux, TRSN: sx, TRSO: cx, TSIZ: fx, TSOA: lx, TSOC: vx, TSOP: hx, TSOT: dx, TSRC: gx, TSSE: px, TSST: yx, TYER: wx, TXXX: bx, UFID: mx, USER: Ex, USLT: Ax, WCOM: Tx, WCOP: Sx, WOAF: Ix, WOAR: Ox, WOAS: xx, WORS: kx, WPAY: Px, WPUB: Rx, WXXX: Cx, WFED: Ux, TCMP: Lx, TGID: Mx, TSO2: Dx, TT1: jx, TT2: Bx, TT3: Fx, TP1: Nx, TP2: _x, TP3: Vx, TP4: Wx, TCM: Gx, TXT: Yx, TLA: $x, TCO: zx, TAL: Kx, TPA: Hx, TRK: Xx, TRC: Jx, TYE: Zx, TDA: qx, TIM: Qx, TRD: tk, TMT: rk, TFT: ek, TBP: nk, TCR: ik, TPB: ok, TEN: ak, TSS: uk, TOF: sk, TLE: ck, TSI: fk, TDY: lk, TKE: vk, TOT: hk, TOA: dk, TOR: gk, TXX: pk, WAF: yk, WAR: wk, WAS: bk, WCM: mk, WCP: Ek, WPB: Ak, WXX: Tk, IPL: Sk, MCI: Ik, ETC: Ok, STC: xk, ULT: kk, SLT: Pk, COM: Rk, RVA: Ck, PIC: Uk, GEO: Lk, CNT: Mk, POP: Dk, GP1: jk, TCP: Bk, unsupported: Fk });
      function _k(t2) {
        return "ID3" === new zp(t2).getString(0, 3).string;
      }
      function Vk(t2, r2, n2) {
        var i2 = new zp(t2, r2), o2 = i2.getUint8(3, 2), a2 = Lb(i2.getUint32(6)), u2 = function(t3, r3) {
          var e2 = { unsynchronisation: Cb(t3, 7) };
          switch (r3) {
            case 2:
              e2.compression = Cb(t3, 6);
              break;
            case 3:
              e2.extendedHeader = Cb(t3, 6), e2.experimentalIndicator = Cb(t3, 5);
              break;
            case 4:
              e2.extendedHeader = Cb(t3, 6), e2.experimentalIndicator = Cb(t3, 5), e2.footerPresent = Cb(t3, 4);
          }
          return e2;
        }(i2.getUint8(5), o2[0]), s2 = { version: o2, flags: u2, size: a2 }, c2 = {};
        if (2 !== o2[0] && 3 !== o2[0] && 4 !== o2[0]) throw new Error("Unknown ID3v2 major version");
        for (var f2 = 2 === o2[0] ? 6 : 10, l2 = 10, v2 = a2, h2 = function(t3) {
          var r3 = ["OWNE", "MCDI", "RVAD", "SYTC", "ETCO", "PCNT"];
          switch (e(t3.value)) {
            case "number":
            case "string":
              t3.value = t3.value.toString(), c2[t3.id] && !r3.includes(t3.id) ? c2[t3.id] += "\\\\" + t3.value : c2[t3.id] = t3.value;
              break;
            case "object":
              r3.includes(t3.id) ? c2[t3.id] = t3.value : c2[t3.id] ? c2[t3.id].push(t3.value) : c2[t3.id] = [t3.value];
          }
        }; l2 < a2; ) {
          var d2 = Wk(i2.getUint8(l2, v2), { version: o2, flags: u2, parseUnsupported: n2 });
          if (!d2) break;
          if (l2 += d2.size + f2, v2 -= d2.size + f2, "SEEK" === d2.id) {
            var g2 = Vk(t2, l2 + d2.value, n2);
            for (var p2 in g2) h2({ id: p2, value: g2[p2] });
          } else h2({ id: d2.id, value: d2.value });
        }
        return { tags: c2, details: s2 };
      }
      function Wk(t2, r2) {
        var e2 = new zp(t2);
        if (0 === e2.getUint8(0)) return false;
        var n2 = {}, i2 = r2.version, o2 = r2.flags, a2 = r2.parseUnsupported, u2 = 2 === i2[0] ? e2.getUint24(3) : e2.getUint32(4);
        n2.id = e2.getUint8String(0, 2 === i2[0] ? 3 : 4), n2.flags = 2 === i2[0] ? {} : function(t3, r3) {
          var e3 = {};
          switch (r3) {
            case 3:
              e3.tagAlterPreservation = Cb(t3[0], 7), e3.fileAlterPreservation = Cb(t3[0], 6), e3.readOnly = Cb(t3[0], 5), e3.compression = Cb(t3[1], 7), e3.encryption = Cb(t3[1], 6), e3.groupingIdentity = Cb(t3[1], 5);
              break;
            case 4:
              e3.tagAlterPreservation = Cb(t3[0], 6), e3.fileAlterPreservation = Cb(t3[0], 5), e3.readOnly = Cb(t3[0], 4), e3.groupingIdentity = Cb(t3[1], 6), e3.compression = Cb(t3[1], 3), e3.encryption = Cb(t3[1], 2), e3.unsynchronisation = Cb(t3[1], 1), e3.dataLengthIndicator = Cb(t3[1], 0);
          }
          return e3;
        }(e2.getUint8(8, 2), i2[0]), n2.size = 4 === i2[0] ? Lb(u2) : u2;
        var s2 = Nk[n2.id];
        if (s2 || a2) {
          var c2, f2 = 2 === i2[0] ? 6 : 10, l2 = n2.size, v2 = n2.size;
          n2.flags.dataLengthIndicator && (l2 = Lb(e2.getUint32(f2)), f2 += 4, v2 -= 4);
          var h2 = o2.unsynchronisation;
          if (4 === i2 && (h2 = n2.flags.unsynchronisation), h2) {
            var d2 = e2.getUint8(f2, v2), g2 = function(t3) {
              for (var r3 = [], e3 = 0; e3 < t3.length; ) r3.push(t3[e3]), 255 === t3[e3] && 0 === t3[e3 + 1] && e3++, e3++;
              return r3;
            }(Array.isArray(d2) ? d2 : [d2]);
            c2 = new Uint8Array(g2);
          } else {
            var p2 = e2.getUint8(f2, l2);
            c2 = new Uint8Array(Array.isArray(p2) ? p2 : [p2]);
          }
          return !s2 && a2 ? (n2.value = Array.from(c2), n2) : (n2.value = s2.parse(c2.buffer, i2[0]), n2);
        }
      }
      var Gk = function() {
        function t2(r2) {
          var e2 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
          if (n(this, t2), !$p(r2)) throw new TypeError("buffer is not ArrayBuffer/Buffer");
          this.verbose = e2, this.buffer = r2, this.tags = {}, this.error = "";
        }
        return o(t2, [{ key: "name", get: function() {
          return "MP3Tag";
        }, set: function(t3) {
          throw new Error("Unable to set this property");
        } }, { key: "version", get: function() {
          return "3.14.1";
        }, set: function(t3) {
          throw new Error("Unable to set this property");
        } }, { key: "read", value: function() {
          var r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          this.tags = {}, this.error = "";
          try {
            this.tags = t2.readBuffer(this.buffer, r2, this.verbose);
          } catch (t3) {
            this.error = t3.message;
          }
          return this.tags;
        } }, { key: "save", value: function() {
          var r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          this.error = "";
          var e2 = this.buffer;
          try {
            e2 = t2.writeBuffer(this.buffer, this.tags, r2, this.verbose);
          } catch (t3) {
            this.error = t3.message;
          }
          return "" === this.error && (this.buffer = e2), this.buffer;
        } }, { key: "remove", value: function() {
          return this.tags = {}, this.error = "", this.buffer = this.getAudio(), true;
        } }, { key: "getAudio", value: function() {
          var r2 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          return t2.getAudioBuffer(this.buffer, r2);
        } }], [{ key: "readBuffer", value: function(t3) {
          var e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          if (!$p(t3)) throw new TypeError("buffer is not ArrayBuffer/Buffer");
          var i2 = {};
          if ((e2 = rI(e2, { id3v1: true, id3v2: true, unsupported: false, encoding: "utf-8" })).id3v1 && _b(t3)) {
            n2 && console.log("ID3v1 found, reading...");
            var o2 = function(t4) {
              var r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "utf-8", e3 = new zp(t4, t4.byteLength - 128), n3 = e3.getString(3, 30, r2).string.replace(/\0/g, ""), i3 = e3.getString(33, 30, r2).string.replace(/\0/g, ""), o3 = e3.getString(63, 30, r2).string.replace(/\0/g, ""), a3 = e3.getString(93, 4, r2).string.replace(/\0/g, ""), u3 = e3.getUint8(126).toString() || "";
              return { tags: { title: n3, artist: i3, album: o3, year: a3, track: u3, comment: e3.getString(97, null !== u3 ? 28 : 30, r2).string.replace(/\0/g, ""), genre: Nb[e3.getUint8(127)] || "" }, details: { version: u3 ? 1 : 0, size: 128 } };
            }(t3, e2.encoding), a2 = o2.tags, u2 = o2.details;
            n2 && console.log("ID3v1 reading finished"), i2.v1 = r({}, a2), i2.v1Details = u2;
          }
          if (e2.id3v2 && _k(t3)) {
            n2 && console.log("ID3v2 found, reading...");
            var s2 = Vk(t3, 0, e2.unsupported), c2 = s2.tags, f2 = s2.details;
            n2 && console.log("ID3v2 reading finished"), i2.v2 = r({}, c2), i2.v2Details = f2;
          }
          return Object.defineProperties(i2, { title: { get: function() {
            return this.v2 && (this.v2.TIT2 || this.v2.TT2) || this.v1 && this.v1.title || "";
          }, set: function(t4) {
            if (this.v2) {
              var r2 = this.v2Details.version[0];
              this.v2[2 === r2 ? "TT2" : "TIT2"] = t4;
            }
            this.v1 && (this.v1.title = t4);
          } }, artist: { get: function() {
            return this.v2 && (this.v2.TPE1 || this.v2.TP1) || this.v1 && this.v1.artist || "";
          }, set: function(t4) {
            if (this.v2) {
              var r2 = this.v2Details.version[0];
              this.v2[2 === r2 ? "TP1" : "TPE1"] = t4;
            }
            this.v1 && (this.v1.artist = t4);
          } }, album: { get: function() {
            return this.v2 && (this.v2.TALB || this.v2.TAL) || this.v1 && this.v1.album || "";
          }, set: function(t4) {
            if (this.v2) {
              var r2 = this.v2Details.version[0];
              this.v2[2 === r2 ? "TAL" : "TALB"] = t4;
            }
            this.v1 && (this.v1.album = t4);
          } }, year: { get: function() {
            return this.v2 && (this.v2.TYER || this.v2.TDRC || this.v2.TYE) || this.v1 && this.v1.year || "";
          }, set: function(t4) {
            if (this.v2) {
              var r2 = this.v2Details.version[0];
              2 === r2 ? this.v2.TYE = t4 : 3 === r2 ? this.v2.TYER = t4 : 4 === r2 && (this.v2.TDRC = t4);
            }
            this.v1 && (this.v1.year = t4);
          } }, comment: { get: function() {
            var t4 = "";
            if (this.v2 && (this.v2.COMM || this.v2.COM)) {
              var r2 = this.v2.COMM || this.v2.COM;
              Array.isArray(r2) && r2.length > 0 && (t4 = r2[0].text);
            } else this.v1 && this.v1.comment && (t4 = this.v1.comment);
            return t4;
          }, set: function(t4) {
            if (this.v2) {
              var r2 = this.v2Details.version[0];
              this.v2[2 === r2 ? "COM" : "COMM"] = [{ language: "eng", descriptor: "", text: t4 }];
            }
            this.v1 && (this.v1.comment = t4);
          } }, track: { get: function() {
            return this.v2 && (this.v2.TRCK && this.v2.TRCK.split("/")[0] || this.v2.TRK && this.v2.TRK.split("/")[0]) || this.v1 && this.v1.track || "";
          }, set: function(t4) {
            if (this.v2 && "" !== t4) {
              var r2 = this.v2Details.version[0];
              this.v2[2 === r2 ? "TRK" : "TRCK"] = t4;
            }
            this.v1 && (this.v1.track = t4);
          } }, genre: { get: function() {
            return this.v2 && (this.v2.TCON || this.v2.TCO) || this.v1 && this.v1.genre || "";
          }, set: function(t4) {
            if (this.v2) {
              var r2 = this.v2Details.version[0];
              this.v2[2 === r2 ? "TCO" : "TCON"] = t4;
            }
            this.v1 && (this.v1.genre = t4);
          } } }), i2;
        } }, { key: "writeBuffer", value: function(r2, e2) {
          var n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, i2 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3], o2 = e2.v2Details ? e2.v2Details.version[0] : 3, a2 = "utf-8";
          n2 = rI(n2, { strict: false, encoding: a2, emptyAudioNone: false, id3v1: { include: false, encoding: void 0 !== n2.id3v1 ? n2.id3v1.encoding : a2 }, id3v2: { include: true, unsynch: false, version: o2, padding: 2048, unsupported: false, encoding: void 0 !== n2.id3v2 ? n2.id3v2.encoding : a2 } });
          var u2 = new Uint8Array(t2.getAudioBuffer(r2, n2.emptyAudioNone));
          if (n2.id3v1.include && void 0 !== e2.v1) {
            i2 && console.log("Validating ID3v1...");
            var s2 = n2.id3v1.encoding || n2.encoding;
            !function(t3, r3) {
              var e3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "utf-8", n3 = t3.title, i3 = t3.artist, o3 = t3.album, a3 = t3.year, u3 = t3.comment, s3 = t3.track, c3 = t3.genre;
              if ("string" != typeof n3) throw new Error("Title is not a string");
              if (Yp(n3, e3).length > 30) throw new Error("Title length exceeds 30 characters");
              if ("string" != typeof i3) throw new Error("Artist is not a string");
              if (Yp(i3, e3).length > 30) throw new Error("Artist length exceeds 30 characters");
              if ("string" != typeof o3) throw new Error("Album is not a string");
              if (Yp(o3, e3).length > 30) throw new Error("Album length exceeds 30 characters");
              if ("string" != typeof a3) throw new Error("Year is not a string");
              if (Yp(a3, e3).length > 4) throw new Error("Year length exceeds 4 characters");
              if ("string" != typeof u3) throw new Error("Comment is not a string");
              if ("string" != typeof s3) throw new Error("Track is not a string");
              if (parseInt(s3) > 255 || parseInt(s3) < 0) throw new Error("Track should be in range 255 - 0");
              if ("" !== s3) {
                if (Yp(u3, e3).length > 28) throw new Error("Comment length exceeds 28 characters");
              } else if (Yp(u3, e3).length > 30) throw new Error("Comment length exceeds 30 characters");
              if ("string" != typeof c3) throw new Error("Genre is not a string");
              if (r3 && !Nb.includes(c3) && "" !== c3) throw new Error("Unknown genre");
            }(e2.v1, n2.strict, s2), i2 && console.log("Writing ID3v1...");
            var c2 = function(t3) {
              var r3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "utf-8", e3 = t3.title, n3 = t3.artist, i3 = t3.album, o3 = t3.year, a3 = t3.comment, u3 = t3.track, s3 = t3.genre;
              for (e3 = Yp(e3, r3), n3 = Yp(n3, r3), i3 = Yp(i3, r3), o3 = Yp(o3, r3), a3 = Yp(a3, r3), s3 = "" !== s3 ? Nb.indexOf(s3) : 255; e3.length < 30; ) e3.push(0);
              for (; n3.length < 30; ) n3.push(0);
              for (; i3.length < 30; ) i3.push(0);
              for (; o3.length < 4; ) o3.push(0);
              if ("" !== u3) {
                for (; a3.length < 28; ) a3.push(0);
                a3.push(0, parseInt(u3));
              } else for (; a3.length < 30; ) a3.push(0);
              return Db(84, 65, 71, e3, n3, i3, o3, a3, s3 > -1 ? s3 : 12).buffer;
            }(e2.v1, s2);
            u2 = Db(u2, new Uint8Array(c2));
          }
          if (n2.id3v2.include && void 0 !== e2.v2) {
            i2 && console.log("Validating ID3v2..."), n2.id3v2.encoding = n2.id3v2.encoding || n2.encoding, n2.id3v2.encodingIndex = function(t3) {
              var r3 = -1;
              switch (t3) {
                case "latin1":
                case "iso-8859-1":
                case "windows1251":
                case "windows-1251":
                case "windows1252":
                case "windows-1252":
                  r3 = 0;
                  break;
                case "utf16":
                case "utf-16":
                  r3 = 1;
                  break;
                case "utf16be":
                case "utf-16be":
                  r3 = 2;
                  break;
                case "utf8":
                case "utf-8":
                  r3 = 3;
                  break;
                default:
                  r3 = -1;
              }
              return r3;
            }(n2.id3v2.encoding), function(t3, r3, e3) {
              var n3 = e3.version, i3 = e3.unsupported, o3 = e3.encoding, a3 = e3.encodingIndex;
              if (2 !== n3 && 3 !== n3 && 4 !== n3) throw new Error("Unknown provided version");
              if (a3 < 0) throw new Error("Unknown provided encoding: ".concat(o3));
              for (var u3 in t3) {
                var s3 = Nk[u3], c3 = s3 && s3.version.includes(n3);
                if (r3 && !c3 && i3) throw new Error("".concat(u3, " is not supported in ID3v2.").concat(n3));
                try {
                  c3 || s3 ? s3.validate(t3[u3], n3, r3) : i3 && Fk.validate(t3[u3], n3, r3);
                } catch (t4) {
                  throw new Error("".concat(t4.message, " at ").concat(u3));
                }
              }
            }(e2.v2, n2.strict, n2.id3v2), i2 && console.log("Writing ID3v2...");
            var f2 = function(t3, r3) {
              var e3 = r3.version, n3 = r3.padding, i3 = r3.unsynch, o3 = r3.unsupported, a3 = r3.encoding, u3 = r3.encodingIndex, s3 = [73, 68, 51, e3, 0], c3 = 0, f3 = new zp(4), l2 = new Uint8Array(n3), v2 = [];
              for (var h2 in t3) {
                var d2 = Nk[h2], g2 = d2 && d2.version.includes(e3);
                if (g2 || o3) {
                  var p2 = { id: h2, version: e3, unsynch: i3, encoding: a3, encodingIndex: u3 };
                  (!g2 && o3 ? Fk.write(t3[h2], p2) : d2.write(t3[h2], p2)).forEach(function(t4) {
                    return v2.push(t4);
                  });
                }
              }
              return i3 && (c3 = Ub(c3, 7)), f3.setUint32(0, Mb(v2.length)), Db(s3, c3, f3.getUint8(0, 4), v2, l2).buffer;
            }(e2.v2, n2.id3v2);
            u2 = Db(new Uint8Array(f2), u2);
          }
          return "undefined" != typeof Buffer ? Buffer.from(u2.buffer) : u2.buffer;
        } }, { key: "getAudioBuffer", value: function(t3) {
          var r2 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
          if (!$p(t3)) throw new TypeError("buffer is not ArrayBuffer/Buffer");
          _b(t3) && (t3 = t3.slice(0, t3.byteLength - 128));
          var e2 = 0;
          _k(t3) && (e2 = Vk(t3).details.size);
          for (var n2 = new zp(t3), i2 = 0; e2 < n2.byteLength; ) {
            if (255 === n2.getUint8(e2) && n2.getUint8(e2 + 1) >= 240) {
              i2 = e2;
              break;
            }
            e2++;
          }
          if (r2 && 0 === i2) return "undefined" != typeof Buffer ? Buffer.alloc(0) : new ArrayBuffer(0);
          var o2 = t3.slice(i2);
          return "undefined" != typeof Buffer ? Buffer.from(o2) : o2;
        } }]), t2;
      }();
      return Gk;
    });
  }
});

// src/DisplayAlbums/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => DisplayAlbums
});
module.exports = __toCommonJS(index_exports);
var import_mp3tag = __toESM(require_mp3tag());

// src/Helpers/index.tsx
var { React, ContextMenu } = BdApi;
var { createElement, forwardRef } = React;
function styledBase(tag, cssOrFn) {
  return (props) => {
    const style = typeof cssOrFn === "function" ? cssOrFn(props) : cssOrFn;
    return React.createElement(tag, { ...props, style: { ...style, ...props.style } });
  };
}
var styled = new Proxy(styledBase, {
  get(target, p, receiver) {
    return (cssOrFn) => target(p, cssOrFn);
  }
});

// src/DisplayAlbums/index.tsx
var { Patcher, Webpack, Data, React: React2, Utils } = new BdApi("DisplayAlbums");
var Slider = Webpack.getModule(Webpack.Filters.byStrings("stickToMarkers", "fillStyles"), { searchExports: true });
var Clickable = Webpack.getModule((x) => String(x.render).includes("secondaryColorClass:"), { searchExports: true });
var Mediabar = Webpack.getByStrings("sliderWrapperClassName");
var AudioModule = Webpack.getBySource("clip_participants", "playbackCacheKey");
var PlayerBackground = styled.div({
  background: "var(--background-base-low)",
  color: "var(--text-default)",
  padding: "16px",
  gap: "16px",
  borderRadius: "8px",
  display: "flex",
  minWidth: "500px",
  flexDirection: "column"
});
var TopSection = styled.div({
  display: "flex",
  flexDirection: "row",
  gap: "16px",
  alignItems: "center"
});
var AlbumArt = styled.img({
  width: "80px",
  height: "80px",
  objectFit: "cover",
  borderRadius: "4px",
  flexShrink: 0,
  background: "var(--background-base-lower)"
});
var MetadataContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "4px",
  flex: 1
});
var Title = styled.div({
  fontSize: "18px",
  fontWeight: "600",
  color: "white"
});
var Info = styled.div({
  fontSize: "12px",
  color: "var(--text-muted)",
  opacity: 0.8
});
var PlayerControls = styled.div({
  display: "flex",
  backgroundColor: "var(--background-base-lowest)",
  alignItems: "center",
  gap: "8px",
  width: "100%"
});
var SliderContainer = styled.div({
  flex: 1
});
function Show({ when, children }) {
  return when && children;
}
var ID3CacheStore = new class ID3 extends Utils.Store {
  id3cache = {};
  cacheID3(name, id3) {
    this.id3cache[name] = id3;
    this.emitChange();
  }
  getID3(name) {
    return this.id3cache[name];
  }
  isCached(name) {
    return !!this.id3cache[name];
  }
}();
var FormattedTime = styled.span({ whiteSpace: "nowrap", fontSize: "12px", opacity: 0.7 });
var Pause = () => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--interactive-icon-default)",
    d: "M16 19q-.825 0-1.412-.587T14 17V7q0-.825.588-1.412T16 5t1.413.588T18 7v10q0 .825-.587 1.413T16 19m-8 0q-.825 0-1.412-.587T6 17V7q0-.825.588-1.412T8 5t1.413.588T10 7v10q0 .825-.587 1.413T8 19"
  }
));
var Resume = () => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--interactive-icon-default)",
    d: "M6 17V7q0-.425.288-.712T7 6t.713.288T8 7v10q0 .425-.288.713T7 18t-.712-.288T6 17m5.525.1q-.5.3-1.012 0T10 16.225v-8.45q0-.575.513-.875t1.012 0l7.05 4.25q.5.3.5.85t-.5.85z"
  }
));
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
function VolumeSlider({ defaultVolume, onValueChange, muted }) {
  const [volume, setVolume] = React2.useState(defaultVolume);
  return /* @__PURE__ */ BdApi.React.createElement(
    Mediabar,
    {
      minValue: 0,
      maxValue: 0.1,
      muted,
      value: volume,
      onValueChange: (newVolume) => {
        setVolume(newVolume);
        onValueChange(newVolume);
      }
    }
  );
}
function AudioComponent({ props, fallback }) {
  const data = props[0];
  const [metadata, setMetadata] = React2.useState(null);
  const [isLoading, setIsLoading] = React2.useState(false);
  const [imageUrl, setImageUrl] = React2.useState("");
  const [didError, setDidError] = React2.useState(false);
  const [isHolding, setIsHolding] = React2.useState(false);
  const [isPlaying, setIsPlaying] = React2.useState(false);
  const [currentTime, setCurrentTime] = React2.useState(0);
  const [finished, setFinished] = React2.useState(false);
  const [duration, setDuration] = React2.useState(0);
  const ref = React2.useRef(null);
  const load = async () => {
    if (isLoading || metadata) return;
    setIsLoading(true);
    try {
      let mp3tag;
      let arrayBuffer;
      if (ID3CacheStore.isCached(data.item.uniqueId)) {
        const cached = ID3CacheStore.getID3(data.item.uniqueId);
        mp3tag = cached.mp3tag;
        arrayBuffer = cached.arrayBuffer;
      } else {
        const response = await BdApi.Net.fetch(data.item.originalItem.proxy_url);
        arrayBuffer = await response.arrayBuffer();
        mp3tag = new import_mp3tag.default(arrayBuffer);
        mp3tag.read();
        ID3CacheStore.cacheID3(data.item.uniqueId, { mp3tag, arrayBuffer });
      }
      setMetadata(mp3tag.tags);
      let pictureData = mp3tag.tags.v2.APIC[0] ? mp3tag.tags.v2.APIC[0] : mp3tag.tags.v2.PIC[0];
      if (pictureData && pictureData.data) {
        const uint8Array = new Uint8Array(pictureData.data);
        let binary = "";
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64 = window.btoa(binary);
        const mimeType = pictureData.format || pictureData.mime || "image/jpeg";
        setImageUrl(`data:${mimeType};base64,${base64}`);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setDidError(true);
    }
  };
  React2.useEffect(() => {
    load();
  }, []);
  React2.useEffect(() => {
    if (ref.current) {
      ref.current.volume = 0.1;
    }
  }, [metadata]);
  if (didError) return fallback;
  return !!metadata && /* @__PURE__ */ BdApi.React.createElement(PlayerBackground, { className: data.className }, /* @__PURE__ */ BdApi.React.createElement(TopSection, null, imageUrl && /* @__PURE__ */ BdApi.React.createElement(AlbumArt, { src: imageUrl }), /* @__PURE__ */ BdApi.React.createElement(MetadataContainer, null, /* @__PURE__ */ BdApi.React.createElement(Show, { when: !!metadata.title }, /* @__PURE__ */ BdApi.React.createElement(Title, null, metadata.title)), /* @__PURE__ */ BdApi.React.createElement(Show, { when: !!metadata.artist }, /* @__PURE__ */ BdApi.React.createElement(Info, null, metadata.artist)), /* @__PURE__ */ BdApi.React.createElement(Show, { when: !!metadata.album }, /* @__PURE__ */ BdApi.React.createElement(Info, null, metadata.album)))), /* @__PURE__ */ BdApi.React.createElement(PlayerControls, null, /* @__PURE__ */ BdApi.React.createElement(Clickable, { icon: isPlaying ? Pause : Resume, onClick: () => {
    if (finished) {
      ref.current.currentTime = 0;
      setCurrentTime(0);
      setFinished(false);
    }
    setIsPlaying((prev) => !prev);
    isPlaying ? ref.current.pause() : ref.current.play();
  } }), /* @__PURE__ */ BdApi.React.createElement(SliderContainer, null, /* @__PURE__ */ BdApi.React.createElement(
    Slider,
    {
      hideBubble: true,
      value: ref?.current?.currentTime || 0,
      maxValue: duration,
      asValueChanges: (newTime) => {
        setIsHolding(true);
        setCurrentTime(newTime);
        if (ref.current) {
          ref.current.currentTime = newTime;
        }
      },
      onValueChange: (newTime) => {
        setIsHolding(false);
        setCurrentTime(newTime);
        if (ref.current) {
          ref.current.currentTime = newTime;
        }
      }
    }
  )), /* @__PURE__ */ BdApi.React.createElement(FormattedTime, null, formatTime(currentTime), " / ", formatTime(duration)), /* @__PURE__ */ BdApi.React.createElement(VolumeSlider, { defaultVolume: 0.1, onValueChange: (newVolume) => {
    if (ref.current) {
      ref.current.volume = newVolume;
    }
  } })), /* @__PURE__ */ BdApi.React.createElement(
    "audio",
    {
      ref,
      onTimeUpdate: (e) => {
        if (!isHolding) {
          setCurrentTime(e.target.currentTime);
        }
      },
      onEnded: () => {
        setIsPlaying(false);
        setFinished(true);
      },
      onLoadedMetadata: (e) => setDuration(e.target.duration),
      src: data.item.originalItem.proxy_url
    }
  ));
}
function getKey(module2, fn) {
  for (var key in module2) {
    if (fn(module2[key])) {
      return { key, module: module2 };
      break;
    }
  }
  return {
    key: null,
    module: null
  };
}
var DisplayAlbums = class {
  start() {
    const module2 = getKey(AudioModule, Webpack.Filters.combine(Webpack.Filters.byStrings("item.originalItem;return(0,"), Webpack.Filters.byStrings("fileSize:")));
    Patcher.after(module2?.module, module2.key, (_, props, res) => {
      return /* @__PURE__ */ BdApi.React.createElement(AudioComponent, { props, fallback: res });
    });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
