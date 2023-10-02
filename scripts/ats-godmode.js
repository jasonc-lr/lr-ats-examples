! function() {
    var e = {
            232: function(e, t, n) {
                "use strict";
                var r = n(1166),
                    o = n(6072),
                    i = o.padLeft,
                    a = o.padRight,
                    s = n(4696).encodeFields,
                    c = n(6340),
                    u = c.decodeFields,
                    d = c.decodePublisherTC;

                function l(e) {
                    for (var t = e; t.length % 4 != 0;) t += "=";
                    t = t.replace(/-/g, "+").replace(/_/g, "/");
                    for (var n = r.decode(t), o = "", a = 0; a < n.length; a += 1) {
                        var s = n.charCodeAt(a).toString(2);
                        o += i(s, 8 - s.length)
                    }
                    return o
                }
                e.exports = {
                    encodeToBase64: function(e, t) {
                        return function(e) {
                            if (e) {
                                for (var t = a(e, 7 - (e.length + 7) % 8), n = "", o = 0; o < t.length; o += 8) n += String.fromCharCode(parseInt(t.substr(o, 8), 2));
                                return r.encode(n).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
                            }
                            return null
                        }(s(e, t))
                    },
                    decodeFromBase64: function(e, t) {
                        var n = l(e);
                        return u(n, t).decodedObject
                    },
                    decodePublisherTCFromBase64: function(e) {
                        var t = l(e);
                        return d(t)
                    },
                    getSegmentType: function(e) {
                        var t = l(e);
                        return parseInt(t.substr(0, 3), 2)
                    }
                }
            },
            6340: function(e) {
                "use strict";

                function t(e, t, n) {
                    if (void 0 !== n && e.length < t + n) throw new Error("Invalid decoding input")
                }

                function n(e, n, r) {
                    return t(e, n, r), parseInt(e.substr(n, r), 2)
                }

                function r(e, r, o) {
                    return t(e, r, o), new Date(100 * n(e, r, o))
                }

                function o(e, t) {
                    return 1 === parseInt(e.substr(t, 1), 2)
                }

                function i(e) {
                    var t = n(e);
                    return String.fromCharCode(t + 65).toLowerCase()
                }

                function a(e, n, r) {
                    t(e, n, r);
                    var o = e.substr(n, r);
                    return i(o.slice(0, r / 2)) + i(o.slice(r / 2))
                }

                function s(e, t, r, o) {
                    var i = t,
                        a = [],
                        s = n(e, i, r);
                    i += r;
                    for (var c = 0; c < s; c += 1) {
                        var u = l(e, o, i),
                            d = u.decodedObject;
                        i = u.newPosition, a.push(d)
                    }
                    return {
                        fieldValue: a,
                        newPosition: i
                    }
                }

                function c(e, t) {
                    var r = t,
                        i = [],
                        a = n(e, r, 12);
                    r += 12;
                    for (var s = 0; s < a;) {
                        var c = o(e, r);
                        if (r += 1, c) {
                            var u = n(e, r, 16),
                                d = n(e, r += 16, 16);
                            r += 16;
                            for (var l = u; l <= d; l += 1) i.push(l)
                        } else {
                            var f = n(e, r, 16);
                            r += 16, i.push(f)
                        }
                        s += 1
                    }
                    return {
                        fieldValue: i,
                        newPosition: r
                    }
                }

                function u(e, n, r) {
                    t(e, n, r);
                    for (var o = [], i = e.substr(n, r), a = 0; a < i.length; a += 1) "0" !== i[a] && o.push(a + 1);
                    return o
                }

                function d(e, t, r) {
                    var i = t,
                        a = n(e, t, r),
                        s = o(e, i += r);
                    return i += 1, s ? c(e, i) : {
                        fieldValue: u(e.substr(i, a)),
                        newPosition: i += a
                    }
                }

                function l(e, t) {
                    var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
                    t.segmentId && (i += 3);
                    var l = t.fields.reduce((function(t, l) {
                        var f = l.name,
                            p = l.numBits,
                            b = function(e, t, i, l) {
                                var f = l.type,
                                    p = l.numBits,
                                    b = "function" == typeof p ? p(t) : p;
                                switch (f) {
                                    case "int":
                                        return {
                                            fieldValue: n(e, i, b)
                                        };
                                    case "bool":
                                        return {
                                            fieldValue: o(e, i)
                                        };
                                    case "date":
                                        return {
                                            fieldValue: r(e, i, b)
                                        };
                                    case "list":
                                        return {
                                            fieldValue: u(e, i, b)
                                        };
                                    case "textcode":
                                        return {
                                            fieldValue: a(e, i, b)
                                        };
                                    case "range":
                                        return c(e, i);
                                    case "minlist":
                                        return d(e, i, b);
                                    case "array":
                                        return s(e, i, b, l);
                                    default:
                                        throw new Error("TCStringV2 - Unknown field type ".concat(f, " for decoding"))
                                }
                            }(e, t, i, l),
                            g = b.fieldValue,
                            h = b.newPosition;
                        return void 0 !== g && (t[f] = g), void 0 !== h ? i = h : "number" == typeof p && (i += p), t
                    }), {});
                    return {
                        decodedObject: l,
                        newPosition: i
                    }
                }
                e.exports = {
                    decodeBitsToInt: n,
                    decodeBitsToBool: o,
                    decodeBitsToDate: r,
                    decodeBitsToLetter: i,
                    decodeBitsToTextCode: a,
                    decodeBitsToRange: c,
                    decodeBitsToMinList: d,
                    decodeBitsToArray: s,
                    decodeFields: l,
                    decodePublisherTC: function(e) {
                        var t = 0,
                            r = n(e, t, 3);
                        if (t += 3, 3 !== r) throw new Error("Invalid consent string");
                        var o = u(e, t, 24),
                            i = u(e, t += 24, 24),
                            a = n(e, t += 24, 6);
                        return {
                            pubPurposesConsent: o,
                            pubPurposesLITransparency: i,
                            numCustomPurposes: a,
                            customPurposesConsent: u(e, t += 6, a),
                            customPurposesLITransparency: u(e, t += a, a)
                        }
                    }
                }
            },
            6022: function(e) {
                "use strict";
                e.exports = {
                    consentStringDefinition: {
                        core: {
                            fields: [{
                                name: "version",
                                type: "int",
                                numBits: 6
                            }, {
                                name: "created",
                                type: "date",
                                numBits: 36
                            }, {
                                name: "lastUpdated",
                                type: "date",
                                numBits: 36
                            }, {
                                name: "cmpId",
                                type: "int",
                                numBits: 12
                            }, {
                                name: "cmpVersion",
                                type: "int",
                                numBits: 12
                            }, {
                                name: "consentScreen",
                                type: "int",
                                numBits: 6
                            }, {
                                name: "consentLanguage",
                                type: "textcode",
                                numBits: 12
                            }, {
                                name: "vendorListVersion",
                                type: "int",
                                numBits: 12
                            }, {
                                name: "tcfPolicyVersion",
                                type: "int",
                                numBits: 6
                            }, {
                                name: "isServiceSpecific",
                                type: "bool",
                                numBits: 1
                            }, {
                                name: "useNonStandardStacks",
                                type: "bool",
                                numBits: 1
                            }, {
                                name: "specialFeatureOptIns",
                                type: "list",
                                numBits: 12
                            }, {
                                name: "purposesConsent",
                                type: "list",
                                numBits: 24
                            }, {
                                name: "purposeLITransparency",
                                type: "list",
                                numBits: 24
                            }, {
                                name: "purposeOneTreatment",
                                type: "bool",
                                numBits: 1
                            }, {
                                name: "publisherCC",
                                type: "textcode",
                                numBits: 12
                            }, {
                                name: "vendorsConsent",
                                type: "minlist",
                                numBits: 16
                            }, {
                                name: "vendorsLegitimateInterest",
                                type: "minlist",
                                numBits: 16
                            }, {
                                name: "publisherRestrictions",
                                type: "array",
                                numBits: 12,
                                fields: [{
                                    name: "purposeId",
                                    type: "int",
                                    numBits: 6
                                }, {
                                    name: "restrictionType",
                                    type: "int",
                                    numBits: 2
                                }, {
                                    name: "restrictedVendors",
                                    type: "range"
                                }]
                            }]
                        },
                        disclosedVendors: {
                            segmentId: 1,
                            fields: [{
                                name: "disclosedVendors",
                                type: "minlist",
                                numBits: 16
                            }]
                        },
                        allowedVendors: {
                            segmentId: 2,
                            fields: [{
                                name: "allowedVendors",
                                type: "minlist",
                                numBits: 16
                            }]
                        },
                        publisherTC: {
                            segmentId: 3,
                            fields: [{
                                name: "pubPurposesConsent",
                                type: "list",
                                numBits: 24
                            }, {
                                name: "pubPurposesLITransparency",
                                type: "list",
                                numBits: 24
                            }, {
                                name: "numCustomPurposes",
                                type: "int",
                                numBits: 6
                            }, {
                                name: "customPurposesConsent",
                                type: "list",
                                numBits: function(e) {
                                    return e.numCustomPurposes
                                }
                            }, {
                                name: "customPurposesLITransparency",
                                type: "list",
                                numBits: function(e) {
                                    return e.numCustomPurposes
                                }
                            }]
                        }
                    }
                }
            },
            4696: function(e, t, n) {
                "use strict";
                var r = n(6072),
                    o = r.padLeft,
                    i = r.getMaxListElement;

                function a(e, t) {
                    var n = "";
                    return "number" != typeof e || Number.isNaN(e) || (n = parseInt(e, 10).toString(2)), t >= n.length && (n = o(n, t - n.length)), n.length > t && (n = n.substring(0, t)), n
                }

                function s(e) {
                    return a(!0 === e ? 1 : 0, 1)
                }

                function c(e, t) {
                    return e instanceof Date ? a(e.getTime() / 100, t) : a(e, t)
                }

                function u(e, t) {
                    return a(e.toUpperCase().charCodeAt(0) - 65, t)
                }

                function d(e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 12;
                    return u(e.slice(0, 1), t / 2) + u(e.slice(1), t / 2)
                }

                function l(e, t) {
                    for (var n = "", r = 1; r <= t; r += 1) n += -1 !== e.indexOf(r) ? "1" : "0";
                    return n
                }

                function f(e) {
                    return a(e.length, 12) + e.reduce((function(e, t) {
                        return e + function(e) {
                            return s(e.isRange) + a(e.startId, 16) + (e.isRange ? a(e.endId, 16) : "")
                        }(t)
                    }), "")
                }

                function p(e) {
                    return f(function(e) {
                        for (var t = i(e), n = [], r = [], o = 1; o <= t; o += 1) {
                            var a = o;
                            if (-1 !== e.indexOf(a) && n.push(a), (-1 === e.indexOf(a) || -1 === e.indexOf(a + 1)) && n.length) {
                                var s = n.shift(),
                                    c = n.pop();
                                n = [], r.push({
                                    isRange: "number" == typeof c,
                                    startId: s,
                                    endId: c
                                })
                            }
                        }
                        return r
                    }(e))
                }

                function b(e, t) {
                    var n = p(e),
                        r = l(e, i(e));
                    return a(i(e), t) + s(n.length < r.length) + (n.length < r.length ? n : r)
                }

                function g(e, t, n) {
                    var r = e || [];
                    return a(r.length, t) + r.reduce((function(e, t) {
                        return e + h(t, n)
                    }), "")
                }

                function h(e, t) {
                    var n = "";
                    return t.segmentId && (n = a(t.segmentId, 3)), t.fields.reduce((function(t, n) {
                        return t + function(e, t) {
                            var n = t.name,
                                r = t.type,
                                o = t.numBits,
                                i = e[n],
                                u = null == i ? "" : i,
                                f = "function" == typeof o ? o(e) : o;
                            switch (r) {
                                case "int":
                                    return a(u, f);
                                case "bool":
                                    return s(u);
                                case "date":
                                    return c(u, f);
                                case "list":
                                    return l(u, f);
                                case "textcode":
                                    return d(u, f);
                                case "range":
                                    return p(u);
                                case "minlist":
                                    return b(u, f);
                                case "array":
                                    return g(u, f, t);
                                default:
                                    throw new Error("TCStringV2 - Unknown field type ".concat(r, " for encoding"))
                            }
                        }(e, n)
                    }), n)
                }
                e.exports = {
                    encodeBoolToBits: s,
                    encodeIntToBits: a,
                    encodeDateToBits: c,
                    encodeLetterToBits: u,
                    encodeTextCodeToBits: d,
                    encodeListToBits: l,
                    encodeListToRangeBits: p,
                    encodeMinListToBits: b,
                    encodeArrayToBits: g,
                    encodeFields: h
                }
            },
            3178: function(e, t, n) {
                "use strict";
                var r = n(8121).TCStringV2;
                e.exports = {
                    TCStringV2: r
                }
            },
            8121: function(e, t, n) {
                "use strict";

                function r(e, t) {
                    var n = Object.keys(e);
                    if (Object.getOwnPropertySymbols) {
                        var r = Object.getOwnPropertySymbols(e);
                        t && (r = r.filter((function(t) {
                            return Object.getOwnPropertyDescriptor(e, t).enumerable
                        }))), n.push.apply(n, r)
                    }
                    return n
                }

                function o(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = null != arguments[t] ? arguments[t] : {};
                        t % 2 ? r(Object(n), !0).forEach((function(t) {
                            i(e, t, n[t])
                        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : r(Object(n)).forEach((function(t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                        }))
                    }
                    return e
                }

                function i(e, t, n) {
                    return t in e ? Object.defineProperty(e, t, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : e[t] = n, e
                }

                function a(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                var s = n(232),
                    c = s.encodeToBase64,
                    u = s.decodeFromBase64,
                    d = s.decodePublisherTCFromBase64,
                    l = s.getSegmentType,
                    f = n(6022).consentStringDefinition,
                    p = function() {
                        function e() {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
                            ! function(e, t) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this, e), this.setConsentString(t)
                        }
                        var t, n, r;
                        return t = e, (n = [{
                            key: "getCoreSegmentData",
                            value: function() {
                                return this.core ? o({}, this.core) : null
                            }
                        }, {
                            key: "setCoreSegmentData",
                            value: function(e) {
                                this.core = o({}, e)
                            }
                        }, {
                            key: "getCoreSegmentString",
                            value: function() {
                                return this.core ? c(this.core, f.core) : null
                            }
                        }, {
                            key: "setCoreSegmentString",
                            value: function(e) {
                                this.core = u(e, f.core)
                            }
                        }, {
                            key: "getDisclosedVendorsData",
                            value: function() {
                                return this.disclosedVendors ? o({}, this.disclosedVendors) : null
                            }
                        }, {
                            key: "setDisclosedVendorsData",
                            value: function(e) {
                                this.disclosedVendors = o({}, e)
                            }
                        }, {
                            key: "getDisclosedVendorsString",
                            value: function() {
                                return this.disclosedVendors ? c(this.disclosedVendors, f.disclosedVendors) : null
                            }
                        }, {
                            key: "setDisclosedVendorsString",
                            value: function(e) {
                                this.disclosedVendors = u(e, f.disclosedVendors)
                            }
                        }, {
                            key: "getAllowedVendorsData",
                            value: function() {
                                return this.allowedVendors ? o({}, this.allowedVendors) : null
                            }
                        }, {
                            key: "setAllowedVendorsData",
                            value: function(e) {
                                this.allowedVendors = o({}, e)
                            }
                        }, {
                            key: "getAllowedVendorsString",
                            value: function() {
                                return this.allowedVendors ? c(this.allowedVendors, f.allowedVendors) : null
                            }
                        }, {
                            key: "setAllowedVendorsString",
                            value: function(e) {
                                this.allowedVendors = u(e, f.allowedVendors)
                            }
                        }, {
                            key: "getPublisherTCData",
                            value: function() {
                                return this.publisherTC ? o({}, this.publisherTC) : null
                            }
                        }, {
                            key: "setPublisherTCData",
                            value: function(e) {
                                this.publisherTC = o({}, e)
                            }
                        }, {
                            key: "getPublisherTCString",
                            value: function() {
                                return this.publisherTC ? c(this.publisherTC, f.publisherTC) : null
                            }
                        }, {
                            key: "setPublisherTCString",
                            value: function(e) {
                                this.publisherTC = d(e)
                            }
                        }, {
                            key: "setConsentString",
                            value: function(e) {
                                if (this.core = null, this.disclosedVendors = null, this.allowedVendors = null, this.publisherTC = null, e) {
                                    var t = e.split(".");
                                    t.length > 0 && this.setCoreSegmentString(t[0]);
                                    for (var n = 1; n < t.length; n += 1) switch (l(t[n])) {
                                        case 1:
                                            this.setAllowedVendorsString(t[n]);
                                            break;
                                        case 2:
                                            this.setDisclosedVendorsString(t[n]);
                                            break;
                                        case 3:
                                            this.setPublisherTCString(t[n]);
                                            break;
                                        default:
                                            throw new Error("Unknown segment type in consent string")
                                    }
                                }
                            }
                        }, {
                            key: "getConsentString",
                            value: function() {
                                var e = [];
                                return this.core ? (e.push(this.getCoreSegmentString()), this.disclosedVendors && e.push(this.getDisclosedVendorsString()), this.allowedVendors && e.push(this.getAllowedVendorsString()), this.publisherTC && e.push(this.getPublisherTCString()), e.join(".")) : null
                            }
                        }]) && a(t.prototype, n), r && a(t, r), e
                    }();
                e.exports = {
                    TCStringV2: p
                }
            },
            6072: function(e) {
                "use strict";

                function t(e) {
                    for (var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "0", n = "", r = 0; r < e; r += 1) n += t;
                    return n
                }
                e.exports = {
                    padLeft: function(e, n) {
                        return t(Math.max(0, n)) + e
                    },
                    padRight: function(e, n) {
                        return e + t(Math.max(0, n))
                    },
                    getMaxListElement: function(e) {
                        var t = 0;
                        return (e || []).forEach((function(e) {
                            e > t && (t = e)
                        })), t
                    }
                }
            },
            1166: function(e, t, n) {
                var r;
                e = n.nmd(e),
                    function(o) {
                        var i = t,
                            a = (e && e.exports, "object" == typeof n.g && n.g);
                        a.global !== a && a.window;
                        var s = function(e) {
                            this.message = e
                        };
                        (s.prototype = new Error).name = "InvalidCharacterError";
                        var c = function(e) {
                                throw new s(e)
                            },
                            u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                            d = /[\t\n\f\r ]/g,
                            l = {
                                encode: function(e) {
                                    e = String(e), /[^\0-\xFF]/.test(e) && c("The string to be encoded contains characters outside of the Latin1 range.");
                                    for (var t, n, r, o, i = e.length % 3, a = "", s = -1, d = e.length - i; ++s < d;) t = e.charCodeAt(s) << 16, n = e.charCodeAt(++s) << 8, r = e.charCodeAt(++s), a += u.charAt((o = t + n + r) >> 18 & 63) + u.charAt(o >> 12 & 63) + u.charAt(o >> 6 & 63) + u.charAt(63 & o);
                                    return 2 == i ? (t = e.charCodeAt(s) << 8, n = e.charCodeAt(++s), a += u.charAt((o = t + n) >> 10) + u.charAt(o >> 4 & 63) + u.charAt(o << 2 & 63) + "=") : 1 == i && (o = e.charCodeAt(s), a += u.charAt(o >> 2) + u.charAt(o << 4 & 63) + "=="), a
                                },
                                decode: function(e) {
                                    var t = (e = String(e).replace(d, "")).length;
                                    t % 4 == 0 && (t = (e = e.replace(/==?$/, "")).length), (t % 4 == 1 || /[^+a-zA-Z0-9/]/.test(e)) && c("Invalid character: the string to be decoded is not correctly encoded.");
                                    for (var n, r, o = 0, i = "", a = -1; ++a < t;) r = u.indexOf(e.charAt(a)), n = o % 4 ? 64 * n + r : r, o++ % 4 && (i += String.fromCharCode(255 & n >> (-2 * o & 6)));
                                    return i
                                },
                                version: "0.1.0"
                            };
                        void 0 === (r = function() {
                            return l
                        }.call(t, n, t, e)) || (e.exports = r)
                    }()
            },
            7111: function(e, t, n) {
                "use strict";
                var r = n(6733),
                    o = n(9821),
                    i = TypeError;
                e.exports = function(e) {
                    if (r(e)) return e;
                    throw i(o(e) + " is not a function")
                }
            },
            1176: function(e, t, n) {
                "use strict";
                var r = n(5052),
                    o = String,
                    i = TypeError;
                e.exports = function(e) {
                    if (r(e)) return e;
                    throw i(o(e) + " is not an object")
                }
            },
            9540: function(e, t, n) {
                "use strict";
                var r = n(905),
                    o = n(3231),
                    i = n(9646),
                    a = function(e) {
                        return function(t, n, a) {
                            var s, c = r(t),
                                u = i(c),
                                d = o(a, u);
                            if (e && n != n) {
                                for (; u > d;)
                                    if ((s = c[d++]) != s) return !0
                            } else
                                for (; u > d; d++)
                                    if ((e || d in c) && c[d] === n) return e || d || 0;
                            return !e && -1
                        }
                    };
                e.exports = {
                    includes: a(!0),
                    indexOf: a(!1)
                }
            },
            1909: function(e, t, n) {
                "use strict";
                var r = n(5968);
                e.exports = r([].slice)
            },
            7079: function(e, t, n) {
                "use strict";
                var r = n(5968),
                    o = r({}.toString),
                    i = r("".slice);
                e.exports = function(e) {
                    return i(o(e), 8, -1)
                }
            },
            7081: function(e, t, n) {
                "use strict";
                var r = n(8270),
                    o = n(4826),
                    i = n(7933),
                    a = n(1787);
                e.exports = function(e, t, n) {
                    for (var s = o(t), c = a.f, u = i.f, d = 0; d < s.length; d++) {
                        var l = s[d];
                        r(e, l) || n && r(n, l) || c(e, l, u(t, l))
                    }
                }
            },
            5762: function(e, t, n) {
                "use strict";
                var r = n(7400),
                    o = n(1787),
                    i = n(5358);
                e.exports = r ? function(e, t, n) {
                    return o.f(e, t, i(1, n))
                } : function(e, t, n) {
                    return e[t] = n, e
                }
            },
            5358: function(e) {
                "use strict";
                e.exports = function(e, t) {
                    return {
                        enumerable: !(1 & e),
                        configurable: !(2 & e),
                        writable: !(4 & e),
                        value: t
                    }
                }
            },
            6616: function(e, t, n) {
                "use strict";
                var r = n(6039),
                    o = n(1787);
                e.exports = function(e, t, n) {
                    return n.get && r(n.get, t, {
                        getter: !0
                    }), n.set && r(n.set, t, {
                        setter: !0
                    }), o.f(e, t, n)
                }
            },
            4768: function(e, t, n) {
                "use strict";
                var r = n(6733),
                    o = n(1787),
                    i = n(6039),
                    a = n(8400);
                e.exports = function(e, t, n, s) {
                    s || (s = {});
                    var c = s.enumerable,
                        u = void 0 !== s.name ? s.name : t;
                    if (r(n) && i(n, u, s), s.global) c ? e[t] = n : a(t, n);
                    else {
                        try {
                            s.unsafe ? e[t] && (c = !0) : delete e[t]
                        } catch (e) {}
                        c ? e[t] = n : o.f(e, t, {
                            value: n,
                            enumerable: !1,
                            configurable: !s.nonConfigurable,
                            writable: !s.nonWritable
                        })
                    }
                    return e
                }
            },
            8400: function(e, t, n) {
                "use strict";
                var r = n(9859),
                    o = Object.defineProperty;
                e.exports = function(e, t) {
                    try {
                        o(r, e, {
                            value: t,
                            configurable: !0,
                            writable: !0
                        })
                    } catch (n) {
                        r[e] = t
                    }
                    return t
                }
            },
            7400: function(e, t, n) {
                "use strict";
                var r = n(4229);
                e.exports = !r((function() {
                    return 7 !== Object.defineProperty({}, 1, {
                        get: function() {
                            return 7
                        }
                    })[1]
                }))
            },
            3777: function(e) {
                "use strict";
                var t = "object" == typeof document && document.all,
                    n = void 0 === t && void 0 !== t;
                e.exports = {
                    all: t,
                    IS_HTMLDDA: n
                }
            },
            2635: function(e, t, n) {
                "use strict";
                var r = n(9859),
                    o = n(5052),
                    i = r.document,
                    a = o(i) && o(i.createElement);
                e.exports = function(e) {
                    return a ? i.createElement(e) : {}
                }
            },
            7995: function(e) {
                "use strict";
                e.exports = "function" == typeof Bun && Bun && "string" == typeof Bun.version
            },
            2023: function(e, t, n) {
                "use strict";
                var r = n(598);
                e.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(r)
            },
            8801: function(e, t, n) {
                "use strict";
                var r = n(9859),
                    o = n(7079);
                e.exports = "process" === o(r.process)
            },
            598: function(e) {
                "use strict";
                e.exports = "undefined" != typeof navigator && String(navigator.userAgent) || ""
            },
            6358: function(e, t, n) {
                "use strict";
                var r, o, i = n(9859),
                    a = n(598),
                    s = i.process,
                    c = i.Deno,
                    u = s && s.versions || c && c.version,
                    d = u && u.v8;
                d && (o = (r = d.split("."))[0] > 0 && r[0] < 4 ? 1 : +(r[0] + r[1])), !o && a && (!(r = a.match(/Edge\/(\d+)/)) || r[1] >= 74) && (r = a.match(/Chrome\/(\d+)/)) && (o = +r[1]), e.exports = o
            },
            3837: function(e) {
                "use strict";
                e.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"]
            },
            3103: function(e, t, n) {
                "use strict";
                var r = n(9859),
                    o = n(7933).f,
                    i = n(5762),
                    a = n(4768),
                    s = n(8400),
                    c = n(7081),
                    u = n(6541);
                e.exports = function(e, t) {
                    var n, d, l, f, p, b = e.target,
                        g = e.global,
                        h = e.stat;
                    if (n = g ? r : h ? r[b] || s(b, {}) : (r[b] || {}).prototype)
                        for (d in t) {
                            if (f = t[d], l = e.dontCallGetSet ? (p = o(n, d)) && p.value : n[d], !u(g ? d : b + (h ? "." : "#") + d, e.forced) && void 0 !== l) {
                                if (typeof f == typeof l) continue;
                                c(f, l)
                            }(e.sham || l && l.sham) && i(f, "sham", !0), a(n, d, f, e)
                        }
                }
            },
            4229: function(e) {
                "use strict";
                e.exports = function(e) {
                    try {
                        return !!e()
                    } catch (e) {
                        return !0
                    }
                }
            },
            3171: function(e, t, n) {
                "use strict";
                var r = n(7188),
                    o = Function.prototype,
                    i = o.apply,
                    a = o.call;
                e.exports = "object" == typeof Reflect && Reflect.apply || (r ? a.bind(i) : function() {
                    return a.apply(i, arguments)
                })
            },
            7636: function(e, t, n) {
                "use strict";
                var r = n(4745),
                    o = n(7111),
                    i = n(7188),
                    a = r(r.bind);
                e.exports = function(e, t) {
                    return o(e), void 0 === t ? e : i ? a(e, t) : function() {
                        return e.apply(t, arguments)
                    }
                }
            },
            7188: function(e, t, n) {
                "use strict";
                var r = n(4229);
                e.exports = !r((function() {
                    var e = function() {}.bind();
                    return "function" != typeof e || e.hasOwnProperty("prototype")
                }))
            },
            266: function(e, t, n) {
                "use strict";
                var r = n(7188),
                    o = Function.prototype.call;
                e.exports = r ? o.bind(o) : function() {
                    return o.apply(o, arguments)
                }
            },
            1805: function(e, t, n) {
                "use strict";
                var r = n(7400),
                    o = n(8270),
                    i = Function.prototype,
                    a = r && Object.getOwnPropertyDescriptor,
                    s = o(i, "name"),
                    c = s && "something" === function() {}.name,
                    u = s && (!r || r && a(i, "name").configurable);
                e.exports = {
                    EXISTS: s,
                    PROPER: c,
                    CONFIGURABLE: u
                }
            },
            4745: function(e, t, n) {
                "use strict";
                var r = n(7079),
                    o = n(5968);
                e.exports = function(e) {
                    if ("Function" === r(e)) return o(e)
                }
            },
            5968: function(e, t, n) {
                "use strict";
                var r = n(7188),
                    o = Function.prototype,
                    i = o.call,
                    a = r && o.bind.bind(i, i);
                e.exports = r ? a : function(e) {
                    return function() {
                        return i.apply(e, arguments)
                    }
                }
            },
            1333: function(e, t, n) {
                "use strict";
                var r = n(9859),
                    o = n(6733);
                e.exports = function(e, t) {
                    return arguments.length < 2 ? (n = r[e], o(n) ? n : void 0) : r[e] && r[e][t];
                    var n
                }
            },
            5300: function(e, t, n) {
                "use strict";
                var r = n(7111),
                    o = n(9650);
                e.exports = function(e, t) {
                    var n = e[t];
                    return o(n) ? void 0 : r(n)
                }
            },
            9859: function(e, t, n) {
                "use strict";
                var r = function(e) {
                    return e && e.Math === Math && e
                };
                e.exports = r("object" == typeof globalThis && globalThis) || r("object" == typeof window && window) || r("object" == typeof self && self) || r("object" == typeof n.g && n.g) || function() {
                    return this
                }() || this || Function("return this")()
            },
            8270: function(e, t, n) {
                "use strict";
                var r = n(5968),
                    o = n(2991),
                    i = r({}.hasOwnProperty);
                e.exports = Object.hasOwn || function(e, t) {
                    return i(o(e), t)
                }
            },
            5977: function(e) {
                "use strict";
                e.exports = {}
            },
            8385: function(e, t, n) {
                "use strict";
                var r = n(1333);
                e.exports = r("document", "documentElement")
            },
            4394: function(e, t, n) {
                "use strict";
                var r = n(7400),
                    o = n(4229),
                    i = n(2635);
                e.exports = !r && !o((function() {
                    return 7 !== Object.defineProperty(i("div"), "a", {
                        get: function() {
                            return 7
                        }
                    }).a
                }))
            },
            9337: function(e, t, n) {
                "use strict";
                var r = n(5968),
                    o = n(4229),
                    i = n(7079),
                    a = Object,
                    s = r("".split);
                e.exports = o((function() {
                    return !a("z").propertyIsEnumerable(0)
                })) ? function(e) {
                    return "String" === i(e) ? s(e, "") : a(e)
                } : a
            },
            8511: function(e, t, n) {
                "use strict";
                var r = n(5968),
                    o = n(6733),
                    i = n(5353),
                    a = r(Function.toString);
                o(i.inspectSource) || (i.inspectSource = function(e) {
                    return a(e)
                }), e.exports = i.inspectSource
            },
            6407: function(e, t, n) {
                "use strict";
                var r, o, i, a = n(1180),
                    s = n(9859),
                    c = n(5052),
                    u = n(5762),
                    d = n(8270),
                    l = n(5353),
                    f = n(4399),
                    p = n(5977),
                    b = "Object already initialized",
                    g = s.TypeError,
                    h = s.WeakMap;
                if (a || l.state) {
                    var y = l.state || (l.state = new h);
                    y.get = y.get, y.has = y.has, y.set = y.set, r = function(e, t) {
                        if (y.has(e)) throw g(b);
                        return t.facade = e, y.set(e, t), t
                    }, o = function(e) {
                        return y.get(e) || {}
                    }, i = function(e) {
                        return y.has(e)
                    }
                } else {
                    var m = f("state");
                    p[m] = !0, r = function(e, t) {
                        if (d(e, m)) throw g(b);
                        return t.facade = e, u(e, m, t), t
                    }, o = function(e) {
                        return d(e, m) ? e[m] : {}
                    }, i = function(e) {
                        return d(e, m)
                    }
                }
                e.exports = {
                    set: r,
                    get: o,
                    has: i,
                    enforce: function(e) {
                        return i(e) ? o(e) : r(e, {})
                    },
                    getterFor: function(e) {
                        return function(t) {
                            var n;
                            if (!c(t) || (n = o(t)).type !== e) throw g("Incompatible receiver, " + e + " required");
                            return n
                        }
                    }
                }
            },
            6733: function(e, t, n) {
                "use strict";
                var r = n(3777),
                    o = r.all;
                e.exports = r.IS_HTMLDDA ? function(e) {
                    return "function" == typeof e || e === o
                } : function(e) {
                    return "function" == typeof e
                }
            },
            6541: function(e, t, n) {
                "use strict";
                var r = n(4229),
                    o = n(6733),
                    i = /#|\.prototype\./,
                    a = function(e, t) {
                        var n = c[s(e)];
                        return n === d || n !== u && (o(t) ? r(t) : !!t)
                    },
                    s = a.normalize = function(e) {
                        return String(e).replace(i, ".").toLowerCase()
                    },
                    c = a.data = {},
                    u = a.NATIVE = "N",
                    d = a.POLYFILL = "P";
                e.exports = a
            },
            9650: function(e) {
                "use strict";
                e.exports = function(e) {
                    return null == e
                }
            },
            5052: function(e, t, n) {
                "use strict";
                var r = n(6733),
                    o = n(3777),
                    i = o.all;
                e.exports = o.IS_HTMLDDA ? function(e) {
                    return "object" == typeof e ? null !== e : r(e) || e === i
                } : function(e) {
                    return "object" == typeof e ? null !== e : r(e)
                }
            },
            4231: function(e) {
                "use strict";
                e.exports = !1
            },
            9395: function(e, t, n) {
                "use strict";
                var r = n(1333),
                    o = n(6733),
                    i = n(1321),
                    a = n(6969),
                    s = Object;
                e.exports = a ? function(e) {
                    return "symbol" == typeof e
                } : function(e) {
                    var t = r("Symbol");
                    return o(t) && i(t.prototype, s(e))
                }
            },
            9646: function(e, t, n) {
                "use strict";
                var r = n(4237);
                e.exports = function(e) {
                    return r(e.length)
                }
            },
            6039: function(e, t, n) {
                "use strict";
                var r = n(5968),
                    o = n(4229),
                    i = n(6733),
                    a = n(8270),
                    s = n(7400),
                    c = n(1805).CONFIGURABLE,
                    u = n(8511),
                    d = n(6407),
                    l = d.enforce,
                    f = d.get,
                    p = String,
                    b = Object.defineProperty,
                    g = r("".slice),
                    h = r("".replace),
                    y = r([].join),
                    m = s && !o((function() {
                        return 8 !== b((function() {}), "length", {
                            value: 8
                        }).length
                    })),
                    v = String(String).split("String"),
                    w = e.exports = function(e, t, n) {
                        "Symbol(" === g(p(t), 0, 7) && (t = "[" + h(p(t), /^Symbol\(([^)]*)\)/, "$1") + "]"), n && n.getter && (t = "get " + t), n && n.setter && (t = "set " + t), (!a(e, "name") || c && e.name !== t) && (s ? b(e, "name", {
                            value: t,
                            configurable: !0
                        }) : e.name = t), m && n && a(n, "arity") && e.length !== n.arity && b(e, "length", {
                            value: n.arity
                        });
                        try {
                            n && a(n, "constructor") && n.constructor ? s && b(e, "prototype", {
                                writable: !1
                            }) : e.prototype && (e.prototype = void 0)
                        } catch (e) {}
                        var r = l(e);
                        return a(r, "source") || (r.source = y(v, "string" == typeof t ? t : "")), e
                    };
                Function.prototype.toString = w((function() {
                    return i(this) && f(this).source || u(this)
                }), "toString")
            },
            917: function(e) {
                "use strict";
                var t = Math.ceil,
                    n = Math.floor;
                e.exports = Math.trunc || function(e) {
                    var r = +e;
                    return (r > 0 ? n : t)(r)
                }
            },
            1787: function(e, t, n) {
                "use strict";
                var r = n(7400),
                    o = n(4394),
                    i = n(7137),
                    a = n(1176),
                    s = n(9310),
                    c = TypeError,
                    u = Object.defineProperty,
                    d = Object.getOwnPropertyDescriptor,
                    l = "enumerable",
                    f = "configurable",
                    p = "writable";
                t.f = r ? i ? function(e, t, n) {
                    if (a(e), t = s(t), a(n), "function" == typeof e && "prototype" === t && "value" in n && p in n && !n[p]) {
                        var r = d(e, t);
                        r && r[p] && (e[t] = n.value, n = {
                            configurable: f in n ? n[f] : r[f],
                            enumerable: l in n ? n[l] : r[l],
                            writable: !1
                        })
                    }
                    return u(e, t, n)
                } : u : function(e, t, n) {
                    if (a(e), t = s(t), a(n), o) try {
                        return u(e, t, n)
                    } catch (e) {}
                    if ("get" in n || "set" in n) throw c("Accessors not supported");
                    return "value" in n && (e[t] = n.value), e
                }
            },
            7933: function(e, t, n) {
                "use strict";
                var r = n(7400),
                    o = n(266),
                    i = n(9195),
                    a = n(5358),
                    s = n(905),
                    c = n(9310),
                    u = n(8270),
                    d = n(4394),
                    l = Object.getOwnPropertyDescriptor;
                t.f = r ? l : function(e, t) {
                    if (e = s(e), t = c(t), d) try {
                        return l(e, t)
                    } catch (e) {}
                    if (u(e, t)) return a(!o(i.f, e, t), e[t])
                }
            },
            8151: function(e, t, n) {
                "use strict";
                var r = n(140),
                    o = n(3837).concat("length", "prototype");
                t.f = Object.getOwnPropertyNames || function(e) {
                    return r(e, o)
                }
            },
            894: function(e, t) {
                "use strict";
                t.f = Object.getOwnPropertySymbols
            },
            1321: function(e, t, n) {
                "use strict";
                var r = n(5968);
                e.exports = r({}.isPrototypeOf)
            },
            140: function(e, t, n) {
                "use strict";
                var r = n(5968),
                    o = n(8270),
                    i = n(905),
                    a = n(9540).indexOf,
                    s = n(5977),
                    c = r([].push);
                e.exports = function(e, t) {
                    var n, r = i(e),
                        u = 0,
                        d = [];
                    for (n in r) !o(s, n) && o(r, n) && c(d, n);
                    for (; t.length > u;) o(r, n = t[u++]) && (~a(d, n) || c(d, n));
                    return d
                }
            },
            9195: function(e, t) {
                "use strict";
                var n = {}.propertyIsEnumerable,
                    r = Object.getOwnPropertyDescriptor,
                    o = r && !n.call({
                        1: 2
                    }, 1);
                t.f = o ? function(e) {
                    var t = r(this, e);
                    return !!t && t.enumerable
                } : n
            },
            2914: function(e, t, n) {
                "use strict";
                var r = n(266),
                    o = n(6733),
                    i = n(5052),
                    a = TypeError;
                e.exports = function(e, t) {
                    var n, s;
                    if ("string" === t && o(n = e.toString) && !i(s = r(n, e))) return s;
                    if (o(n = e.valueOf) && !i(s = r(n, e))) return s;
                    if ("string" !== t && o(n = e.toString) && !i(s = r(n, e))) return s;
                    throw a("Can't convert object to primitive value")
                }
            },
            4826: function(e, t, n) {
                "use strict";
                var r = n(1333),
                    o = n(5968),
                    i = n(8151),
                    a = n(894),
                    s = n(1176),
                    c = o([].concat);
                e.exports = r("Reflect", "ownKeys") || function(e) {
                    var t = i.f(s(e)),
                        n = a.f;
                    return n ? c(t, n(e)) : t
                }
            },
            895: function(e, t, n) {
                "use strict";
                var r = n(1176);
                e.exports = function() {
                    var e = r(this),
                        t = "";
                    return e.hasIndices && (t += "d"), e.global && (t += "g"), e.ignoreCase && (t += "i"), e.multiline && (t += "m"), e.dotAll && (t += "s"), e.unicode && (t += "u"), e.unicodeSets && (t += "v"), e.sticky && (t += "y"), t
                }
            },
            8885: function(e, t, n) {
                "use strict";
                var r = n(9650),
                    o = TypeError;
                e.exports = function(e) {
                    if (r(e)) throw o("Can't call method on " + e);
                    return e
                }
            },
            4752: function(e, t, n) {
                "use strict";
                var r, o = n(9859),
                    i = n(3171),
                    a = n(6733),
                    s = n(7995),
                    c = n(598),
                    u = n(1909),
                    d = n(7579),
                    l = o.Function,
                    f = /MSIE .\./.test(c) || s && ((r = o.Bun.version.split(".")).length < 3 || "0" === r[0] && (r[1] < 3 || "3" === r[1] && "0" === r[2]));
                e.exports = function(e, t) {
                    var n = t ? 2 : 1;
                    return f ? function(r, o) {
                        var s = d(arguments.length, 1) > n,
                            c = a(r) ? r : l(r),
                            f = s ? u(arguments, n) : [],
                            p = s ? function() {
                                i(c, this, f)
                            } : c;
                        return t ? e(p, o) : e(p)
                    } : e
                }
            },
            4399: function(e, t, n) {
                "use strict";
                var r = n(3036),
                    o = n(1441),
                    i = r("keys");
                e.exports = function(e) {
                    return i[e] || (i[e] = o(e))
                }
            },
            5353: function(e, t, n) {
                "use strict";
                var r = n(9859),
                    o = n(8400),
                    i = "__core-js_shared__",
                    a = r[i] || o(i, {});
                e.exports = a
            },
            3036: function(e, t, n) {
                "use strict";
                var r = n(4231),
                    o = n(5353);
                (e.exports = function(e, t) {
                    return o[e] || (o[e] = void 0 !== t ? t : {})
                })("versions", []).push({
                    version: "3.32.2",
                    mode: r ? "pure" : "global",
                    copyright: "Â© 2014-2023 Denis Pushkarev (zloirock.ru)",
                    license: "https://github.com/zloirock/core-js/blob/v3.32.2/LICENSE",
                    source: "https://github.com/zloirock/core-js"
                })
            },
            4860: function(e, t, n) {
                "use strict";
                var r = n(6358),
                    o = n(4229),
                    i = n(9859).String;
                e.exports = !!Object.getOwnPropertySymbols && !o((function() {
                    var e = Symbol("symbol detection");
                    return !i(e) || !(Object(e) instanceof Symbol) || !Symbol.sham && r && r < 41
                }))
            },
            5795: function(e, t, n) {
                "use strict";
                var r, o, i, a, s = n(9859),
                    c = n(3171),
                    u = n(7636),
                    d = n(6733),
                    l = n(8270),
                    f = n(4229),
                    p = n(8385),
                    b = n(1909),
                    g = n(2635),
                    h = n(7579),
                    y = n(2023),
                    m = n(8801),
                    v = s.setImmediate,
                    w = s.clearImmediate,
                    S = s.process,
                    C = s.Dispatch,
                    O = s.Function,
                    A = s.MessageChannel,
                    E = s.String,
                    P = 0,
                    x = {},
                    _ = "onreadystatechange";
                f((function() {
                    r = s.location
                }));
                var T = function(e) {
                        if (l(x, e)) {
                            var t = x[e];
                            delete x[e], t()
                        }
                    },
                    I = function(e) {
                        return function() {
                            T(e)
                        }
                    },
                    D = function(e) {
                        T(e.data)
                    },
                    R = function(e) {
                        s.postMessage(E(e), r.protocol + "//" + r.host)
                    };
                v && w || (v = function(e) {
                    h(arguments.length, 1);
                    var t = d(e) ? e : O(e),
                        n = b(arguments, 1);
                    return x[++P] = function() {
                        c(t, void 0, n)
                    }, o(P), P
                }, w = function(e) {
                    delete x[e]
                }, m ? o = function(e) {
                    S.nextTick(I(e))
                } : C && C.now ? o = function(e) {
                    C.now(I(e))
                } : A && !y ? (a = (i = new A).port2, i.port1.onmessage = D, o = u(a.postMessage, a)) : s.addEventListener && d(s.postMessage) && !s.importScripts && r && "file:" !== r.protocol && !f(R) ? (o = R, s.addEventListener("message", D, !1)) : o = _ in g("script") ? function(e) {
                    p.appendChild(g("script"))[_] = function() {
                        p.removeChild(this), T(e)
                    }
                } : function(e) {
                    setTimeout(I(e), 0)
                }), e.exports = {
                    set: v,
                    clear: w
                }
            },
            3231: function(e, t, n) {
                "use strict";
                var r = n(3329),
                    o = Math.max,
                    i = Math.min;
                e.exports = function(e, t) {
                    var n = r(e);
                    return n < 0 ? o(n + t, 0) : i(n, t)
                }
            },
            905: function(e, t, n) {
                "use strict";
                var r = n(9337),
                    o = n(8885);
                e.exports = function(e) {
                    return r(o(e))
                }
            },
            3329: function(e, t, n) {
                "use strict";
                var r = n(917);
                e.exports = function(e) {
                    var t = +e;
                    return t != t || 0 === t ? 0 : r(t)
                }
            },
            4237: function(e, t, n) {
                "use strict";
                var r = n(3329),
                    o = Math.min;
                e.exports = function(e) {
                    return e > 0 ? o(r(e), 9007199254740991) : 0
                }
            },
            2991: function(e, t, n) {
                "use strict";
                var r = n(8885),
                    o = Object;
                e.exports = function(e) {
                    return o(r(e))
                }
            },
            2066: function(e, t, n) {
                "use strict";
                var r = n(266),
                    o = n(5052),
                    i = n(9395),
                    a = n(5300),
                    s = n(2914),
                    c = n(95),
                    u = TypeError,
                    d = c("toPrimitive");
                e.exports = function(e, t) {
                    if (!o(e) || i(e)) return e;
                    var n, c = a(e, d);
                    if (c) {
                        if (void 0 === t && (t = "default"), n = r(c, e, t), !o(n) || i(n)) return n;
                        throw u("Can't convert object to primitive value")
                    }
                    return void 0 === t && (t = "number"), s(e, t)
                }
            },
            9310: function(e, t, n) {
                "use strict";
                var r = n(2066),
                    o = n(9395);
                e.exports = function(e) {
                    var t = r(e, "string");
                    return o(t) ? t : t + ""
                }
            },
            9821: function(e) {
                "use strict";
                var t = String;
                e.exports = function(e) {
                    try {
                        return t(e)
                    } catch (e) {
                        return "Object"
                    }
                }
            },
            1441: function(e, t, n) {
                "use strict";
                var r = n(5968),
                    o = 0,
                    i = Math.random(),
                    a = r(1..toString);
                e.exports = function(e) {
                    return "Symbol(" + (void 0 === e ? "" : e) + ")_" + a(++o + i, 36)
                }
            },
            6969: function(e, t, n) {
                "use strict";
                var r = n(4860);
                e.exports = r && !Symbol.sham && "symbol" == typeof Symbol.iterator
            },
            7137: function(e, t, n) {
                "use strict";
                var r = n(7400),
                    o = n(4229);
                e.exports = r && o((function() {
                    return 42 !== Object.defineProperty((function() {}), "prototype", {
                        value: 42,
                        writable: !1
                    }).prototype
                }))
            },
            7579: function(e) {
                "use strict";
                var t = TypeError;
                e.exports = function(e, n) {
                    if (e < n) throw t("Not enough arguments");
                    return e
                }
            },
            1180: function(e, t, n) {
                "use strict";
                var r = n(9859),
                    o = n(6733),
                    i = r.WeakMap;
                e.exports = o(i) && /native code/.test(String(i))
            },
            95: function(e, t, n) {
                "use strict";
                var r = n(9859),
                    o = n(3036),
                    i = n(8270),
                    a = n(1441),
                    s = n(4860),
                    c = n(6969),
                    u = r.Symbol,
                    d = o("wks"),
                    l = c ? u.for || u : u && u.withoutSetter || a;
                e.exports = function(e) {
                    return i(d, e) || (d[e] = s && i(u, e) ? u[e] : l("Symbol." + e)), d[e]
                }
            },
            103: function(e, t, n) {
                "use strict";
                var r = n(9859),
                    o = n(7400),
                    i = n(6616),
                    a = n(895),
                    s = n(4229),
                    c = r.RegExp,
                    u = c.prototype;
                o && s((function() {
                    var e = !0;
                    try {
                        c(".", "d")
                    } catch (t) {
                        e = !1
                    }
                    var t = {},
                        n = "",
                        r = e ? "dgimsy" : "gimsy",
                        o = function(e, r) {
                            Object.defineProperty(t, e, {
                                get: function() {
                                    return n += r, !0
                                }
                            })
                        },
                        i = {
                            dotAll: "s",
                            global: "g",
                            ignoreCase: "i",
                            multiline: "m",
                            sticky: "y"
                        };
                    for (var a in e && (i.hasIndices = "d"), i) o(a, i[a]);
                    return Object.getOwnPropertyDescriptor(u, "flags").get.call(t) !== r || n !== r
                })) && i(u, "flags", {
                    configurable: !0,
                    get: a
                })
            },
            8596: function(e, t, n) {
                "use strict";
                var r = n(3103),
                    o = n(9859),
                    i = n(5795).clear;
                r({
                    global: !0,
                    bind: !0,
                    enumerable: !0,
                    forced: o.clearImmediate !== i
                }, {
                    clearImmediate: i
                })
            },
            6106: function(e, t, n) {
                "use strict";
                n(8596), n(6471)
            },
            6471: function(e, t, n) {
                "use strict";
                var r = n(3103),
                    o = n(9859),
                    i = n(5795).set,
                    a = n(4752),
                    s = o.setImmediate ? a(i, !1) : i;
                r({
                    global: !0,
                    bind: !0,
                    enumerable: !0,
                    forced: o.setImmediate !== s
                }, {
                    setImmediate: s
                })
            },
            2471: function(e, t) {
                var n, r;
                r = "undefined" != typeof self ? self : this, n = function() {
                    return function(e) {
                        "use strict";
                        if ("function" != typeof Promise) throw "Promise support required";
                        var t = e.crypto || e.msCrypto;
                        if (t) {
                            var n = t.subtle || t.webkitSubtle;
                            if (n) {
                                var r = e.Crypto || t.constructor || Object,
                                    o = e.SubtleCrypto || n.constructor || Object,
                                    i = (e.CryptoKey || e.Key, e.navigator.userAgent.indexOf("Edge/") > -1),
                                    a = !!e.msCrypto && !i,
                                    s = !t.subtle && !!t.webkitSubtle;
                                if (a || s) {
                                    var c = {
                                            KoZIhvcNAQEB: "1.2.840.113549.1.1.1"
                                        },
                                        u = {
                                            "1.2.840.113549.1.1.1": "KoZIhvcNAQEB"
                                        };
                                    if (["generateKey", "importKey", "unwrapKey"].forEach((function(e) {
                                            var r = n[e];
                                            n[e] = function(o, i, c) {
                                                var u, d, l, b, w = [].slice.call(arguments);
                                                switch (e) {
                                                    case "generateKey":
                                                        u = g(o), d = i, l = c;
                                                        break;
                                                    case "importKey":
                                                        u = g(c), d = w[3], l = w[4], "jwk" === o && ((i = y(i)).alg || (i.alg = h(u)), i.key_ops || (i.key_ops = "oct" !== i.kty ? "d" in i ? l.filter(E) : l.filter(A) : l.slice()), w[1] = m(i));
                                                        break;
                                                    case "unwrapKey":
                                                        u = w[4], d = w[5], l = w[6], w[2] = c._key
                                                }
                                                if ("generateKey" === e && "HMAC" === u.name && u.hash) return u.length = u.length || {
                                                    "SHA-1": 512,
                                                    "SHA-256": 512,
                                                    "SHA-384": 1024,
                                                    "SHA-512": 1024
                                                } [u.hash.name], n.importKey("raw", t.getRandomValues(new Uint8Array(u.length + 7 >> 3)), u, d, l);
                                                if (s && "generateKey" === e && "RSASSA-PKCS1-v1_5" === u.name && (!u.modulusLength || u.modulusLength >= 2048)) return (o = g(o)).name = "RSAES-PKCS1-v1_5", delete o.hash, n.generateKey(o, !0, ["encrypt", "decrypt"]).then((function(e) {
                                                    return Promise.all([n.exportKey("jwk", e.publicKey), n.exportKey("jwk", e.privateKey)])
                                                })).then((function(e) {
                                                    return e[0].alg = e[1].alg = h(u), e[0].key_ops = l.filter(A), e[1].key_ops = l.filter(E), Promise.all([n.importKey("jwk", e[0], u, !0, e[0].key_ops), n.importKey("jwk", e[1], u, d, e[1].key_ops)])
                                                })).then((function(e) {
                                                    return {
                                                        publicKey: e[0],
                                                        privateKey: e[1]
                                                    }
                                                }));
                                                if ((s || a && "SHA-1" === (u.hash || {}).name) && "importKey" === e && "jwk" === o && "HMAC" === u.name && "oct" === i.kty) return n.importKey("raw", p(f(i.k)), c, w[3], w[4]);
                                                if (s && "importKey" === e && ("spki" === o || "pkcs8" === o)) return n.importKey("jwk", v(i), c, w[3], w[4]);
                                                if (a && "unwrapKey" === e) return n.decrypt(w[3], c, i).then((function(e) {
                                                    return n.importKey(o, e, w[4], w[5], w[6])
                                                }));
                                                try {
                                                    b = r.apply(n, w)
                                                } catch (e) {
                                                    return Promise.reject(e)
                                                }
                                                return a && (b = new Promise((function(e, t) {
                                                    b.onabort = b.onerror = function(e) {
                                                        t(e)
                                                    }, b.oncomplete = function(t) {
                                                        e(t.target.result)
                                                    }
                                                }))), b = b.then((function(e) {
                                                    return "HMAC" === u.name && (u.length || (u.length = 8 * e.algorithm.length)), 0 == u.name.search("RSA") && (u.modulusLength || (u.modulusLength = (e.publicKey || e).algorithm.modulusLength), u.publicExponent || (u.publicExponent = (e.publicKey || e).algorithm.publicExponent)), e = e.publicKey && e.privateKey ? {
                                                        publicKey: new O(e.publicKey, u, d, l.filter(A)),
                                                        privateKey: new O(e.privateKey, u, d, l.filter(E))
                                                    } : new O(e, u, d, l)
                                                }))
                                            }
                                        })), ["exportKey", "wrapKey"].forEach((function(e) {
                                            var t = n[e];
                                            n[e] = function(r, o, i) {
                                                var c, u = [].slice.call(arguments);
                                                switch (e) {
                                                    case "exportKey":
                                                        u[1] = o._key;
                                                        break;
                                                    case "wrapKey":
                                                        u[1] = o._key, u[2] = i._key
                                                }
                                                if ((s || a && "SHA-1" === (o.algorithm.hash || {}).name) && "exportKey" === e && "jwk" === r && "HMAC" === o.algorithm.name && (u[0] = "raw"), !s || "exportKey" !== e || "spki" !== r && "pkcs8" !== r || (u[0] = "jwk"), a && "wrapKey" === e) return n.exportKey(r, o).then((function(e) {
                                                    return "jwk" === r && (e = p(unescape(encodeURIComponent(JSON.stringify(y(e)))))), n.encrypt(u[3], i, e)
                                                }));
                                                try {
                                                    c = t.apply(n, u)
                                                } catch (e) {
                                                    return Promise.reject(e)
                                                }
                                                return a && (c = new Promise((function(e, t) {
                                                    c.onabort = c.onerror = function(e) {
                                                        t(e)
                                                    }, c.oncomplete = function(t) {
                                                        e(t.target.result)
                                                    }
                                                }))), "exportKey" === e && "jwk" === r && (c = c.then((function(e) {
                                                    return (s || a && "SHA-1" === (o.algorithm.hash || {}).name) && "HMAC" === o.algorithm.name ? {
                                                        kty: "oct",
                                                        alg: h(o.algorithm),
                                                        key_ops: o.usages.slice(),
                                                        ext: !0,
                                                        k: l(b(e))
                                                    } : ((e = y(e)).alg || (e.alg = h(o.algorithm)), e.key_ops || (e.key_ops = "public" === o.type ? o.usages.filter(A) : "private" === o.type ? o.usages.filter(E) : o.usages.slice()), e)
                                                }))), !s || "exportKey" !== e || "spki" !== r && "pkcs8" !== r || (c = c.then((function(e) {
                                                    return e = w(y(e))
                                                }))), c
                                            }
                                        })), ["encrypt", "decrypt", "sign", "verify"].forEach((function(e) {
                                            var t = n[e];
                                            n[e] = function(r, o, i, s) {
                                                if (a && (!i.byteLength || s && !s.byteLength)) throw new Error("Empty input is not allowed");
                                                var c, u = [].slice.call(arguments),
                                                    d = g(r);
                                                if (!a || "sign" !== e && "verify" !== e || "RSASSA-PKCS1-v1_5" !== r && "HMAC" !== r || (u[0] = {
                                                        name: r
                                                    }), a && o.algorithm.hash && (u[0].hash = u[0].hash || o.algorithm.hash), a && "decrypt" === e && "AES-GCM" === d.name) {
                                                    var l = r.tagLength >> 3;
                                                    u[2] = (i.buffer || i).slice(0, i.byteLength - l), r.tag = (i.buffer || i).slice(i.byteLength - l)
                                                }
                                                a && "AES-GCM" === d.name && void 0 === u[0].tagLength && (u[0].tagLength = 128), u[1] = o._key;
                                                try {
                                                    c = t.apply(n, u)
                                                } catch (e) {
                                                    return Promise.reject(e)
                                                }
                                                return a && (c = new Promise((function(t, n) {
                                                    c.onabort = c.onerror = function(e) {
                                                        n(e)
                                                    }, c.oncomplete = function(n) {
                                                        if (n = n.target.result, "encrypt" === e && n instanceof AesGcmEncryptResult) {
                                                            var r = n.ciphertext,
                                                                o = n.tag;
                                                            (n = new Uint8Array(r.byteLength + o.byteLength)).set(new Uint8Array(r), 0), n.set(new Uint8Array(o), r.byteLength), n = n.buffer
                                                        }
                                                        t(n)
                                                    }
                                                }))), c
                                            }
                                        })), a) {
                                        var d = n.digest;
                                        n.digest = function(e, t) {
                                            if (!t.byteLength) throw new Error("Empty input is not allowed");
                                            var r;
                                            try {
                                                r = d.call(n, e, t)
                                            } catch (e) {
                                                return Promise.reject(e)
                                            }
                                            return r = new Promise((function(e, t) {
                                                r.onabort = r.onerror = function(e) {
                                                    t(e)
                                                }, r.oncomplete = function(t) {
                                                    e(t.target.result)
                                                }
                                            }))
                                        }, e.crypto = Object.create(t, {
                                            getRandomValues: {
                                                value: function(e) {
                                                    return t.getRandomValues(e)
                                                }
                                            },
                                            subtle: {
                                                value: n
                                            }
                                        }), e.CryptoKey = O
                                    }
                                    s && (t.subtle = n, e.Crypto = r, e.SubtleCrypto = o, e.CryptoKey = O)
                                }
                            }
                        }

                        function l(e) {
                            return btoa(e).replace(/\=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")
                        }

                        function f(e) {
                            return e = (e += "===").slice(0, -e.length % 4), atob(e.replace(/-/g, "+").replace(/_/g, "/"))
                        }

                        function p(e) {
                            for (var t = new Uint8Array(e.length), n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
                            return t
                        }

                        function b(e) {
                            return e instanceof ArrayBuffer && (e = new Uint8Array(e)), String.fromCharCode.apply(String, e)
                        }

                        function g(e) {
                            var t = {
                                name: (e.name || e || "").toUpperCase().replace("V", "v")
                            };
                            switch (t.name) {
                                case "SHA-1":
                                case "SHA-256":
                                case "SHA-384":
                                case "SHA-512":
                                    break;
                                case "AES-CBC":
                                case "AES-GCM":
                                case "AES-KW":
                                    e.length && (t.length = e.length);
                                    break;
                                case "HMAC":
                                    e.hash && (t.hash = g(e.hash)), e.length && (t.length = e.length);
                                    break;
                                case "RSAES-PKCS1-v1_5":
                                    e.publicExponent && (t.publicExponent = new Uint8Array(e.publicExponent)), e.modulusLength && (t.modulusLength = e.modulusLength);
                                    break;
                                case "RSASSA-PKCS1-v1_5":
                                case "RSA-OAEP":
                                    e.hash && (t.hash = g(e.hash)), e.publicExponent && (t.publicExponent = new Uint8Array(e.publicExponent)), e.modulusLength && (t.modulusLength = e.modulusLength);
                                    break;
                                default:
                                    throw new SyntaxError("Bad algorithm name")
                            }
                            return t
                        }

                        function h(e) {
                            return {
                                HMAC: {
                                    "SHA-1": "HS1",
                                    "SHA-256": "HS256",
                                    "SHA-384": "HS384",
                                    "SHA-512": "HS512"
                                },
                                "RSASSA-PKCS1-v1_5": {
                                    "SHA-1": "RS1",
                                    "SHA-256": "RS256",
                                    "SHA-384": "RS384",
                                    "SHA-512": "RS512"
                                },
                                "RSAES-PKCS1-v1_5": {
                                    "": "RSA1_5"
                                },
                                "RSA-OAEP": {
                                    "SHA-1": "RSA-OAEP",
                                    "SHA-256": "RSA-OAEP-256"
                                },
                                "AES-KW": {
                                    128: "A128KW",
                                    192: "A192KW",
                                    256: "A256KW"
                                },
                                "AES-GCM": {
                                    128: "A128GCM",
                                    192: "A192GCM",
                                    256: "A256GCM"
                                },
                                "AES-CBC": {
                                    128: "A128CBC",
                                    192: "A192CBC",
                                    256: "A256CBC"
                                }
                            } [e.name][(e.hash || {}).name || e.length || ""]
                        }

                        function y(e) {
                            (e instanceof ArrayBuffer || e instanceof Uint8Array) && (e = JSON.parse(decodeURIComponent(escape(b(e)))));
                            var t = {
                                kty: e.kty,
                                alg: e.alg,
                                ext: e.ext || e.extractable
                            };
                            switch (t.kty) {
                                case "oct":
                                    t.k = e.k;
                                case "RSA":
                                    ["n", "e", "d", "p", "q", "dp", "dq", "qi", "oth"].forEach((function(n) {
                                        n in e && (t[n] = e[n])
                                    }));
                                    break;
                                default:
                                    throw new TypeError("Unsupported key type")
                            }
                            return t
                        }

                        function m(e) {
                            var t = y(e);
                            return a && (t.extractable = t.ext, delete t.ext), p(unescape(encodeURIComponent(JSON.stringify(t)))).buffer
                        }

                        function v(e) {
                            var t = S(e),
                                n = !1;
                            t.length > 2 && (n = !0, t.shift());
                            var r = {
                                ext: !0
                            };
                            if ("1.2.840.113549.1.1.1" !== t[0][0]) throw new TypeError("Unsupported key type");
                            var o = ["n", "e", "d", "p", "q", "dp", "dq", "qi"],
                                i = S(t[1]);
                            n && i.shift();
                            for (var a = 0; a < i.length; a++) i[a][0] || (i[a] = i[a].subarray(1)), r[o[a]] = l(b(i[a]));
                            return r.kty = "RSA", r
                        }

                        function w(e) {
                            var t, n = [
                                    ["", null]
                                ],
                                r = !1;
                            if ("RSA" !== e.kty) throw new TypeError("Unsupported key type");
                            for (var o = ["n", "e", "d", "p", "q", "dp", "dq", "qi"], i = [], a = 0; a < o.length && o[a] in e; a++) {
                                var s = i[a] = p(f(e[o[a]]));
                                128 & s[0] && (i[a] = new Uint8Array(s.length + 1), i[a].set(s, 1))
                            }
                            return i.length > 2 && (r = !0, i.unshift(new Uint8Array([0]))), n[0][0] = "1.2.840.113549.1.1.1", t = i, n.push(new Uint8Array(C(t)).buffer), r ? n.unshift(new Uint8Array([0])) : n[1] = {
                                tag: 3,
                                value: n[1]
                            }, new Uint8Array(C(n)).buffer
                        }

                        function S(e, t) {
                            if (e instanceof ArrayBuffer && (e = new Uint8Array(e)), t || (t = {
                                    pos: 0,
                                    end: e.length
                                }), t.end - t.pos < 2 || t.end > e.length) throw new RangeError("Malformed DER");
                            var n, r = e[t.pos++],
                                o = e[t.pos++];
                            if (o >= 128) {
                                if (o &= 127, t.end - t.pos < o) throw new RangeError("Malformed DER");
                                for (var i = 0; o--;) i <<= 8, i |= e[t.pos++];
                                o = i
                            }
                            if (t.end - t.pos < o) throw new RangeError("Malformed DER");
                            switch (r) {
                                case 2:
                                    n = e.subarray(t.pos, t.pos += o);
                                    break;
                                case 3:
                                    if (e[t.pos++]) throw new Error("Unsupported bit string");
                                    o--;
                                case 4:
                                    n = new Uint8Array(e.subarray(t.pos, t.pos += o)).buffer;
                                    break;
                                case 5:
                                    n = null;
                                    break;
                                case 6:
                                    var a = btoa(b(e.subarray(t.pos, t.pos += o)));
                                    if (!(a in c)) throw new Error("Unsupported OBJECT ID " + a);
                                    n = c[a];
                                    break;
                                case 48:
                                    n = [];
                                    for (var s = t.pos + o; t.pos < s;) n.push(S(e, t));
                                    break;
                                default:
                                    throw new Error("Unsupported DER tag 0x" + r.toString(16))
                            }
                            return n
                        }

                        function C(e, t) {
                            t || (t = []);
                            var n = 0,
                                r = 0,
                                o = t.length + 2;
                            if (t.push(0, 0), e instanceof Uint8Array) {
                                n = 2, r = e.length;
                                for (var i = 0; i < r; i++) t.push(e[i])
                            } else if (e instanceof ArrayBuffer)
                                for (n = 4, r = e.byteLength, e = new Uint8Array(e), i = 0; i < r; i++) t.push(e[i]);
                            else if (null === e) n = 5, r = 0;
                            else if ("string" == typeof e && e in u) {
                                var a = p(atob(u[e]));
                                for (n = 6, r = a.length, i = 0; i < r; i++) t.push(a[i])
                            } else if (e instanceof Array) {
                                for (i = 0; i < e.length; i++) C(e[i], t);
                                n = 48, r = t.length - o
                            } else {
                                if (!("object" == typeof e && 3 === e.tag && e.value instanceof ArrayBuffer)) throw new Error("Unsupported DER value " + e);
                                for (n = 3, r = (e = new Uint8Array(e.value)).byteLength, t.push(0), i = 0; i < r; i++) t.push(e[i]);
                                r++
                            }
                            if (r >= 128) {
                                var s = r;
                                for (r = 4, t.splice(o, 0, s >> 24 & 255, s >> 16 & 255, s >> 8 & 255, 255 & s); r > 1 && !(s >> 24);) s <<= 8, r--;
                                r < 4 && t.splice(o, 4 - r), r |= 128
                            }
                            return t.splice(o - 2, 2, n, r), t
                        }

                        function O(e, t, n, r) {
                            Object.defineProperties(this, {
                                _key: {
                                    value: e
                                },
                                type: {
                                    value: e.type,
                                    enumerable: !0
                                },
                                extractable: {
                                    value: void 0 === n ? e.extractable : n,
                                    enumerable: !0
                                },
                                algorithm: {
                                    value: void 0 === t ? e.algorithm : t,
                                    enumerable: !0
                                },
                                usages: {
                                    value: void 0 === r ? e.usages : r,
                                    enumerable: !0
                                }
                            })
                        }

                        function A(e) {
                            return "verify" === e || "encrypt" === e || "wrapKey" === e
                        }

                        function E(e) {
                            return "sign" === e || "decrypt" === e || "unwrapKey" === e
                        }
                    }(r)
                }.apply(t, []), void 0 === n || (e.exports = n)
            },
            4147: function(e) {
                "use strict";
                e.exports = JSON.parse('{"name":"atsenvelopemodule","version":"1.3.0","description":"ats-envelope-module","main":"src/index.js","scripts":{"test":"jest","clean":"rimraf coverage build","build:dev:only":"webpack --mode=development","build:dev":"run-s clean build:dev:only","build:prod:only":"webpack --mode=production","build:prod":"run-s clean build:prod:only","start":"webpack-dev-server --https","lint":"eslint \\"src/\\" --ext .js -c ../../.eslintrc","lint:fix":"eslint \\"src/\\" --ext .js --fix -c ../../.eslintrc","format":"prettier --write \\"**/*.js\\"","format:staged":"pretty-quick --staged"},"author":"","license":"ISC"}')
            }
        },
        t = {};

    function n(r) {
        var o = t[r];
        if (void 0 !== o) return o.exports;
        var i = t[r] = {
            id: r,
            loaded: !1,
            exports: {}
        };
        return e[r].call(i.exports, i, i.exports, n), i.loaded = !0, i.exports
    }
    n.d = function(e, t) {
        for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
            enumerable: !0,
            get: t[r]
        })
    }, n.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window) return window
        }
    }(), n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.nmd = function(e) {
        return e.paths = [], e.children || (e.children = []), e
    };
    var r = {};
    ! function() {
        "use strict";
        n.r(r), n.d(r, {
            invalidateEnvelope: function() {
                return It
            },
            outputCurrentConfiguration: function() {
                return Tt
            },
            retrieveEnvelope: function() {
                return _t
            },
            setAdditionalData: function() {
                return xt
            },
            setOptOut: function() {
                return Dt
            },
            setOptOutStateBasedOnStoredIdentifier: function() {
                return Rt
            },
            start: function() {
                return Pt
            }
        });
        n(103), n(6106);
        var e = "undefined" != typeof globalThis && globalThis || "undefined" != typeof self && self || void 0 !== n.g && n.g || {},
            t = "URLSearchParams" in e,
            o = "Symbol" in e && "iterator" in Symbol,
            i = "FileReader" in e && "Blob" in e && function() {
                try {
                    return new Blob, !0
                } catch (e) {
                    return !1
                }
            }(),
            a = "FormData" in e,
            s = "ArrayBuffer" in e;
        if (s) var c = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]"],
            u = ArrayBuffer.isView || function(e) {
                return e && c.indexOf(Object.prototype.toString.call(e)) > -1
            };

        function d(e) {
            if ("string" != typeof e && (e = String(e)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(e) || "" === e) throw new TypeError('Invalid character in header field name: "' + e + '"');
            return e.toLowerCase()
        }

        function l(e) {
            return "string" != typeof e && (e = String(e)), e
        }

        function f(e) {
            var t = {
                next: function() {
                    var t = e.shift();
                    return {
                        done: void 0 === t,
                        value: t
                    }
                }
            };
            return o && (t[Symbol.iterator] = function() {
                return t
            }), t
        }

        function p(e) {
            this.map = {}, e instanceof p ? e.forEach((function(e, t) {
                this.append(t, e)
            }), this) : Array.isArray(e) ? e.forEach((function(e) {
                if (2 != e.length) throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + e.length);
                this.append(e[0], e[1])
            }), this) : e && Object.getOwnPropertyNames(e).forEach((function(t) {
                this.append(t, e[t])
            }), this)
        }

        function b(e) {
            if (!e._noBody) return e.bodyUsed ? Promise.reject(new TypeError("Already read")) : void(e.bodyUsed = !0)
        }

        function g(e) {
            return new Promise((function(t, n) {
                e.onload = function() {
                    t(e.result)
                }, e.onerror = function() {
                    n(e.error)
                }
            }))
        }

        function h(e) {
            var t = new FileReader,
                n = g(t);
            return t.readAsArrayBuffer(e), n
        }

        function y(e) {
            if (e.slice) return e.slice(0);
            var t = new Uint8Array(e.byteLength);
            return t.set(new Uint8Array(e)), t.buffer
        }

        function m() {
            return this.bodyUsed = !1, this._initBody = function(e) {
                var n;
                this.bodyUsed = this.bodyUsed, this._bodyInit = e, e ? "string" == typeof e ? this._bodyText = e : i && Blob.prototype.isPrototypeOf(e) ? this._bodyBlob = e : a && FormData.prototype.isPrototypeOf(e) ? this._bodyFormData = e : t && URLSearchParams.prototype.isPrototypeOf(e) ? this._bodyText = e.toString() : s && i && ((n = e) && DataView.prototype.isPrototypeOf(n)) ? (this._bodyArrayBuffer = y(e.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : s && (ArrayBuffer.prototype.isPrototypeOf(e) || u(e)) ? this._bodyArrayBuffer = y(e) : this._bodyText = e = Object.prototype.toString.call(e) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || ("string" == typeof e ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : t && URLSearchParams.prototype.isPrototypeOf(e) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"))
            }, i && (this.blob = function() {
                var e = b(this);
                if (e) return e;
                if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
                if (this._bodyArrayBuffer) return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                if (this._bodyFormData) throw new Error("could not read FormData body as blob");
                return Promise.resolve(new Blob([this._bodyText]))
            }), this.arrayBuffer = function() {
                if (this._bodyArrayBuffer) {
                    var e = b(this);
                    return e || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset, this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength)) : Promise.resolve(this._bodyArrayBuffer))
                }
                if (i) return this.blob().then(h);
                throw new Error("could not read as ArrayBuffer")
            }, this.text = function() {
                var e, t, n, r, o, i = b(this);
                if (i) return i;
                if (this._bodyBlob) return e = this._bodyBlob, t = new FileReader, n = g(t), r = /charset=([A-Za-z0-9_-]+)/.exec(e.type), o = r ? r[1] : "utf-8", t.readAsText(e, o), n;
                if (this._bodyArrayBuffer) return Promise.resolve(function(e) {
                    for (var t = new Uint8Array(e), n = new Array(t.length), r = 0; r < t.length; r++) n[r] = String.fromCharCode(t[r]);
                    return n.join("")
                }(this._bodyArrayBuffer));
                if (this._bodyFormData) throw new Error("could not read FormData body as text");
                return Promise.resolve(this._bodyText)
            }, a && (this.formData = function() {
                return this.text().then(S)
            }), this.json = function() {
                return this.text().then(JSON.parse)
            }, this
        }
        p.prototype.append = function(e, t) {
            e = d(e), t = l(t);
            var n = this.map[e];
            this.map[e] = n ? n + ", " + t : t
        }, p.prototype.delete = function(e) {
            delete this.map[d(e)]
        }, p.prototype.get = function(e) {
            return e = d(e), this.has(e) ? this.map[e] : null
        }, p.prototype.has = function(e) {
            return this.map.hasOwnProperty(d(e))
        }, p.prototype.set = function(e, t) {
            this.map[d(e)] = l(t)
        }, p.prototype.forEach = function(e, t) {
            for (var n in this.map) this.map.hasOwnProperty(n) && e.call(t, this.map[n], n, this)
        }, p.prototype.keys = function() {
            var e = [];
            return this.forEach((function(t, n) {
                e.push(n)
            })), f(e)
        }, p.prototype.values = function() {
            var e = [];
            return this.forEach((function(t) {
                e.push(t)
            })), f(e)
        }, p.prototype.entries = function() {
            var e = [];
            return this.forEach((function(t, n) {
                e.push([n, t])
            })), f(e)
        }, o && (p.prototype[Symbol.iterator] = p.prototype.entries);
        var v = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];

        function w(t, n) {
            if (!(this instanceof w)) throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
            var r, o, i = (n = n || {}).body;
            if (t instanceof w) {
                if (t.bodyUsed) throw new TypeError("Already read");
                this.url = t.url, this.credentials = t.credentials, n.headers || (this.headers = new p(t.headers)), this.method = t.method, this.mode = t.mode, this.signal = t.signal, i || null == t._bodyInit || (i = t._bodyInit, t.bodyUsed = !0)
            } else this.url = String(t);
            if (this.credentials = n.credentials || this.credentials || "same-origin", !n.headers && this.headers || (this.headers = new p(n.headers)), this.method = (r = n.method || this.method || "GET", o = r.toUpperCase(), v.indexOf(o) > -1 ? o : r), this.mode = n.mode || this.mode || null, this.signal = n.signal || this.signal || function() {
                    if ("AbortController" in e) return (new AbortController).signal
                }(), this.referrer = null, ("GET" === this.method || "HEAD" === this.method) && i) throw new TypeError("Body not allowed for GET or HEAD requests");
            if (this._initBody(i), !("GET" !== this.method && "HEAD" !== this.method || "no-store" !== n.cache && "no-cache" !== n.cache)) {
                var a = /([?&])_=[^&]*/;
                if (a.test(this.url)) this.url = this.url.replace(a, "$1_=" + (new Date).getTime());
                else {
                    this.url += (/\?/.test(this.url) ? "&" : "?") + "_=" + (new Date).getTime()
                }
            }
        }

        function S(e) {
            var t = new FormData;
            return e.trim().split("&").forEach((function(e) {
                if (e) {
                    var n = e.split("="),
                        r = n.shift().replace(/\+/g, " "),
                        o = n.join("=").replace(/\+/g, " ");
                    t.append(decodeURIComponent(r), decodeURIComponent(o))
                }
            })), t
        }

        function C(e, t) {
            if (!(this instanceof C)) throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
            if (t || (t = {}), this.type = "default", this.status = void 0 === t.status ? 200 : t.status, this.status < 200 || this.status > 599) throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
            this.ok = this.status >= 200 && this.status < 300, this.statusText = void 0 === t.statusText ? "" : "" + t.statusText, this.headers = new p(t.headers), this.url = t.url || "", this._initBody(e)
        }
        w.prototype.clone = function() {
            return new w(this, {
                body: this._bodyInit
            })
        }, m.call(w.prototype), m.call(C.prototype), C.prototype.clone = function() {
            return new C(this._bodyInit, {
                status: this.status,
                statusText: this.statusText,
                headers: new p(this.headers),
                url: this.url
            })
        }, C.error = function() {
            var e = new C(null, {
                status: 200,
                statusText: ""
            });
            return e.status = 0, e.type = "error", e
        };
        var O = [301, 302, 303, 307, 308];
        C.redirect = function(e, t) {
            if (-1 === O.indexOf(t)) throw new RangeError("Invalid status code");
            return new C(null, {
                status: t,
                headers: {
                    location: e
                }
            })
        };
        var A = e.DOMException;
        try {
            new A
        } catch (e) {
            (A = function(e, t) {
                this.message = e, this.name = t;
                var n = Error(e);
                this.stack = n.stack
            }).prototype = Object.create(Error.prototype), A.prototype.constructor = A
        }

        function E(t, n) {
            return new Promise((function(r, o) {
                var a = new w(t, n);
                if (a.signal && a.signal.aborted) return o(new A("Aborted", "AbortError"));
                var c = new XMLHttpRequest;

                function u() {
                    c.abort()
                }
                if (c.onload = function() {
                        var e, t, n = {
                            statusText: c.statusText,
                            headers: (e = c.getAllResponseHeaders() || "", t = new p, e.replace(/\r?\n[\t ]+/g, " ").split("\r").map((function(e) {
                                return 0 === e.indexOf("\n") ? e.substr(1, e.length) : e
                            })).forEach((function(e) {
                                var n = e.split(":"),
                                    r = n.shift().trim();
                                if (r) {
                                    var o = n.join(":").trim();
                                    try {
                                        t.append(r, o)
                                    } catch (e) {
                                        console.warn("Response " + e.message)
                                    }
                                }
                            })), t)
                        };
                        a.url.startsWith("file://") && (c.status < 200 || c.status > 599) ? n.status = 200 : n.status = c.status, n.url = "responseURL" in c ? c.responseURL : n.headers.get("X-Request-URL");
                        var o = "response" in c ? c.response : c.responseText;
                        setTimeout((function() {
                            r(new C(o, n))
                        }), 0)
                    }, c.onerror = function() {
                        setTimeout((function() {
                            o(new TypeError("Network request failed"))
                        }), 0)
                    }, c.ontimeout = function() {
                        setTimeout((function() {
                            o(new TypeError("Network request timed out"))
                        }), 0)
                    }, c.onabort = function() {
                        setTimeout((function() {
                            o(new A("Aborted", "AbortError"))
                        }), 0)
                    }, c.open(a.method, function(t) {
                        try {
                            return "" === t && e.location.href ? e.location.href : t
                        } catch (e) {
                            return t
                        }
                    }(a.url), !0), "include" === a.credentials ? c.withCredentials = !0 : "omit" === a.credentials && (c.withCredentials = !1), "responseType" in c && (i ? c.responseType = "blob" : s && (c.responseType = "arraybuffer")), n && "object" == typeof n.headers && !(n.headers instanceof p || e.Headers && n.headers instanceof e.Headers)) {
                    var f = [];
                    Object.getOwnPropertyNames(n.headers).forEach((function(e) {
                        f.push(d(e)), c.setRequestHeader(e, l(n.headers[e]))
                    })), a.headers.forEach((function(e, t) {
                        -1 === f.indexOf(t) && c.setRequestHeader(t, e)
                    }))
                } else a.headers.forEach((function(e, t) {
                    c.setRequestHeader(t, e)
                }));
                a.signal && (a.signal.addEventListener("abort", u), c.onreadystatechange = function() {
                    4 === c.readyState && a.signal.removeEventListener("abort", u)
                }), c.send(void 0 === a._bodyInit ? null : a._bodyInit)
            }))
        }
        E.polyfill = !0, e.fetch || (e.fetch = E, e.Headers = p, e.Request = w, e.Response = C);
        n(2471);

        function P(e) {
            return P = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }, P(e)
        }

        function x(e) {
            var t = function(e, t) {
                if ("object" !== P(e) || null === e) return e;
                var n = e[Symbol.toPrimitive];
                if (void 0 !== n) {
                    var r = n.call(e, t || "default");
                    if ("object" !== P(r)) return r;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === t ? String : Number)(e)
            }(e, "string");
            return "symbol" === P(t) ? t : String(t)
        }
        let _, T = "(ATS)";

        function I(e, t) {
            _ = D.includes(e) ? e : "info", T = t
        }
        const D = ["debug", "info", "warn", "error"];
        var R = D.reduce(((e, t, n) => (e[t] = function() {
            const e = "debug" === t ? "log" : t;
            if (_ && console && "function" == typeof console[e]) {
                const a = D.indexOf(_.toString().toLocaleLowerCase());
                if (!0 === _ || a > -1 && n >= a) {
                    for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++) o[i] = arguments[i];
                    const [n, ...a] = [...o];
                    console[e](`${t.toUpperCase()} - ${T} ${n}`, ...a)
                }
            }
        }, e)), {});
        const k = {
            placementID: -1,
            storageType: "cookie",
            expirationTime: 1296e6,
            expirationRefreshTime: 18e5,
            logging: void 0,
            email: void 0,
            emailHashes: void 0,
            urlHashType: void 0,
            phoneNumber: void 0,
            customerID: void 0,
            accountID: void 0,
            customerIDRegex: void 0,
            catchIdentifier: !0,
            ccpaConsentString: void 0,
            gdprConsentString: void 0,
            gppConsentString: void 0,
            startWithExternalId: !1,
            rootDomain: void 0,
            testMode: !1,
            useESP: !1,
            placementCountries: [],
            configUrlList: [],
            pubOptout: !1,
            usePAIR: !1
        };
        var B = new class {
            constructor() {
                var e, t, n;
                e = this, n = e => {
                    if (e) {
                        const t = function(e, t) {
                            const n = {
                                ...e
                            };
                            for (const e in t) "placementID" === e ? Number.isInteger(+t.placementID) ? n.placementID = +t.placementID : R.error("placementID is not a number!") : "expirationTime" === e ? Number.isInteger(+t.expirationTime) ? n.expirationTime = +t.expirationTime : R.error("expirationTime is not a number!") : n[e] = t[e];
                            return n
                        }(this, e);
                        Object.assign(this, t)
                    }
                }, (t = x(t = "update")) in e ? Object.defineProperty(e, t, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = n, this.update(k)
            }
        };

        function U(e, t) {
            let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 31536e3,
                r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "/",
                o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : void 0,
                i = new Date;
            i.setTime(i.getTime() + 1e3 * n);
            let a = ";expires=" + i.toUTCString(),
                s = ";max-age=" + n,
                c = ";path=" + r,
                u = o ? ";domain=" + o : "",
                d = e + "=" + encodeURIComponent(t);
            document.cookie = d + s + a + u + c
        }

        function N(e) {
            const t = e + "=",
                n = document.cookie.split(";");
            for (let e = 0; e < n.length; e++) {
                const r = n[e].trim();
                if (0 === r.indexOf(t)) return decodeURIComponent(r.substring(t.length, r.length))
            }
            return ""
        }

        function L(e, t) {
            const n = new Date;
            n.setTime(n.getTime() - 864e5);
            const r = `expires=${n.toUTCString()}`;
            document.cookie = t ? `${e}=;domain=${t};path=/;${r}` : `${e}=;path=/;${r}`
        }

        function j(e) {
            null !== localStorage.getItem(e) && localStorage.removeItem(e)
        }

        function V(e) {
            return function(e) {
                for (var t, n = "0123456789ABCDEF", r = "", o = 0; o < e.length; o++) t = e.charCodeAt(o), r += n.charAt(t >>> 4 & 15) + n.charAt(15 & t);
                return r
            }(function(e) {
                for (var t = "", n = 0; n < 32 * e.length; n += 8) t += String.fromCharCode(e[n >> 5] >>> n % 32 & 255);
                return t
            }(function(e, t) {
                e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
                for (var n = 1732584193, r = -271733879, o = -1732584194, i = 271733878, a = 0; a < e.length; a += 16) {
                    const t = n,
                        s = r,
                        c = o,
                        u = i;
                    r = F(r = F(r = F(r = F(r = G(r = G(r = G(r = G(r = K(r = K(r = K(r = K(r = H(r = H(r = H(r = H(r, o = H(o, i = H(i, n = H(n, r, o, i, e[a], 7, -680876936), r, o, e[a + 1], 12, -389564586), n, r, e[a + 2], 17, 606105819), i, n, e[a + 3], 22, -1044525330), o = H(o, i = H(i, n = H(n, r, o, i, e[a + 4], 7, -176418897), r, o, e[a + 5], 12, 1200080426), n, r, e[a + 6], 17, -1473231341), i, n, e[a + 7], 22, -45705983), o = H(o, i = H(i, n = H(n, r, o, i, e[a + 8], 7, 1770035416), r, o, e[a + 9], 12, -1958414417), n, r, e[a + 10], 17, -42063), i, n, e[a + 11], 22, -1990404162), o = H(o, i = H(i, n = H(n, r, o, i, e[a + 12], 7, 1804603682), r, o, e[a + 13], 12, -40341101), n, r, e[a + 14], 17, -1502002290), i, n, e[a + 15], 22, 1236535329), o = K(o, i = K(i, n = K(n, r, o, i, e[a + 1], 5, -165796510), r, o, e[a + 6], 9, -1069501632), n, r, e[a + 11], 14, 643717713), i, n, e[a], 20, -373897302), o = K(o, i = K(i, n = K(n, r, o, i, e[a + 5], 5, -701558691), r, o, e[a + 10], 9, 38016083), n, r, e[a + 15], 14, -660478335), i, n, e[a + 4], 20, -405537848), o = K(o, i = K(i, n = K(n, r, o, i, e[a + 9], 5, 568446438), r, o, e[a + 14], 9, -1019803690), n, r, e[a + 3], 14, -187363961), i, n, e[a + 8], 20, 1163531501), o = K(o, i = K(i, n = K(n, r, o, i, e[a + 13], 5, -1444681467), r, o, e[a + 2], 9, -51403784), n, r, e[a + 7], 14, 1735328473), i, n, e[a + 12], 20, -1926607734), o = G(o, i = G(i, n = G(n, r, o, i, e[a + 5], 4, -378558), r, o, e[a + 8], 11, -2022574463), n, r, e[a + 11], 16, 1839030562), i, n, e[a + 14], 23, -35309556), o = G(o, i = G(i, n = G(n, r, o, i, e[a + 1], 4, -1530992060), r, o, e[a + 4], 11, 1272893353), n, r, e[a + 7], 16, -155497632), i, n, e[a + 10], 23, -1094730640), o = G(o, i = G(i, n = G(n, r, o, i, e[a + 13], 4, 681279174), r, o, e[a], 11, -358537222), n, r, e[a + 3], 16, -722521979), i, n, e[a + 6], 23, 76029189), o = G(o, i = G(i, n = G(n, r, o, i, e[a + 9], 4, -640364487), r, o, e[a + 12], 11, -421815835), n, r, e[a + 15], 16, 530742520), i, n, e[a + 2], 23, -995338651), o = F(o, i = F(i, n = F(n, r, o, i, e[a], 6, -198630844), r, o, e[a + 7], 10, 1126891415), n, r, e[a + 14], 15, -1416354905), i, n, e[a + 5], 21, -57434055), o = F(o, i = F(i, n = F(n, r, o, i, e[a + 12], 6, 1700485571), r, o, e[a + 3], 10, -1894986606), n, r, e[a + 10], 15, -1051523), i, n, e[a + 1], 21, -2054922799), o = F(o, i = F(i, n = F(n, r, o, i, e[a + 8], 6, 1873313359), r, o, e[a + 15], 10, -30611744), n, r, e[a + 6], 15, -1560198380), i, n, e[a + 13], 21, 1309151649), o = F(o, i = F(i, n = F(n, r, o, i, e[a + 4], 6, -145523070), r, o, e[a + 11], 10, -1120210379), n, r, e[a + 2], 15, 718787259), i, n, e[a + 9], 21, -343485551), n = J(n, t), r = J(r, s), o = J(o, c), i = J(i, u)
                }
                return Array(n, r, o, i)
            }(function(e) {
                for (var t = Array(e.length >> 2), n = 0; n < t.length; n++) t[n] = 0;
                for (n = 0; n < 8 * e.length; n += 8) t[n >> 5] |= (255 & e.charCodeAt(n / 8)) << n % 32;
                return t
            }(e), 8 * e.length))).toLowerCase()
        }

        function M(e, t, n, r, o, i) {
            return J(function(e, t) {
                return e << t | e >>> 32 - t
            }(J(J(t, e), J(r, i)), o), n)
        }

        function H(e, t, n, r, o, i, a) {
            return M(t & n | ~t & r, e, t, o, i, a)
        }

        function K(e, t, n, r, o, i, a) {
            return M(t & r | n & ~r, e, t, o, i, a)
        }

        function G(e, t, n, r, o, i, a) {
            return M(t ^ n ^ r, e, t, o, i, a)
        }

        function F(e, t, n, r, o, i, a) {
            return M(n ^ (t | ~r), e, t, o, i, a)
        }

        function J(e, t) {
            const n = (65535 & e) + (65535 & t);
            return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n
        }
        const $ = /((([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,}))/i;

        function q(e) {
            if (window.TextEncoder) return new TextEncoder("utf-8").encode(e);
            const t = unescape(encodeURIComponent(e)),
                n = new Uint8Array(t.length);
            for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
            return n
        }
        async function W(e) {
            return V(e)
        }
        async function z(e) {
            const t = q(e);
            try {
                return Q(await crypto.subtle.digest("SHA-256", t))
            } catch (e) {
                return console.error("SHA-256 encryption failed: " + e), ""
            }
        }
        async function Z(e) {
            const t = q(e);
            try {
                return Q(await crypto.subtle.digest("SHA-1", t))
            } catch (e) {
                return console.error("SHA-1 encryption failed: " + e), ""
            }
        }

        function X(e) {
            const t = (e = e.toLowerCase().trim()).split("@");
            let n = t[0];
            const r = t[1];
            let o = n.indexOf("+");
            return -1 === o && (o = n.indexOf(" ")), -1 === o && (o = n.indexOf("%2b")), -1 !== o && (n = n.slice(0, o)), "gmail.com" === r && (n = n.replace(/\./g, "")), n + "@" + r
        }

        function Y(e) {
            return $.test(e)
        }

        function Q(e) {
            const t = [],
                n = new DataView(e);
            for (let e = 0; e < n.byteLength; e += 4) {
                const r = "00000000",
                    o = (r + n.getUint32(e).toString(16)).slice(-r.length);
                t.push(o)
            }
            return t.join("")
        }
        const ee = Object.freeze({
                LIVERAMP: "LIVERAMP",
                FACEBOOK: "FACEBOOK",
                PAIR_ID: "PAIR_ID"
            }),
            te = Object.freeze({
                LIVERAMP: "_lr_env",
                FACEBOOK: "_lr_fb_env",
                PAIR_ID: "_lr_pairId"
            }),
            ne = Object.freeze({
                LIVERAMP: 19,
                FACEBOOK: 24,
                PAIR_ID: 25
            }),
            re = Object.freeze({
                USNAT: 7,
                USCA: 8,
                USVA: 9,
                USCO: 10,
                USUT: 11,
                USCT: 12
            }),
            oe = 10,
            ie = {
                method: "GET",
                mode: "cors"
            },
            ae = /(\+1)|[.]|[(]|[)]|[-]|[ ]/gi,
            se = "https://geo.privacymanager.io/";
        async function ce(e) {
            try {
                const t = await fetch(e, ie);
                if (t && 200 === t.status && null !== t.body) return t.json()
            } catch (e) {
                console.error("There has been a problem with your fetch operation: ", e)
            }
        }
        async function ue() {
            let e = N("_lr_geo_location");
            if ("" === e) {
                const t = await async function() {
                    const e = await ce(se);
                    if (e) return e;
                    console.error("Geo location is undefined or empty")
                }();
                e = t.country, U("_lr_geo_location_state", t.region, 86400), e && "" !== e || (e = "US"), U("_lr_geo_location", e, 86400)
            }
            return e
        }

        function de(e) {
            const t = new CustomEvent(e);
            window.dispatchEvent(t)
        }

        function le(e, t) {
            let n = new Date;
            return n.setMonth(n.getMonth() - e), +n > 1e3 * t
        }
        async function fe(e, t) {
            const n = {
                method: "POST",
                headers: new Headers({
                    "content-type": "application/json",
                    Accept: "application/json"
                })
            };
            n.body = JSON.stringify(t);
            try {
                const t = await fetch(e, n);
                if (t && 200 === t.status) return t.json();
                throw new Error("Status code is not 200 ", t)
            } catch (e) {
                console.error("There has been a problem with HTTP POST method: ", e)
            }
        }

        function pe(e) {
            j(te.LIVERAMP), L(te.LIVERAMP, e), j(te.FACEBOOK), L(te.FACEBOOK), j(te.PAIR_ID), L(te.PAIR_ID, e), j("_lr_cached_events"), L("_lr_hashed_pid", e)
        }
        async function be(e, t, n) {
            if (n)
                if ("email" === t) {
                    U("_lr_hashed_pid", await z(X(e)), 1296e3)
                } else if ("phoneNumber" === t) {
                U("_lr_hashed_pid", await Z((r = e, r.replace(ae, ""))), 1296e3)
            } else if ("customerID" === t) {
                U("_lr_hashed_pid", await z(e.customerId), 1296e3)
            } else if ("emailHashes" === t)
                if (e instanceof Array) {
                    let t = function(e) {
                        for (let t in e)
                            if (64 === e[t].length) return e[t].length;
                        for (let t in e)
                            if (40 === e[t].length) return e[t].length
                    }(e);
                    t && U("_lr_hashed_pid", t, 1296e3)
                } else U("_lr_hashed_pid", e, 1296e3);
            var r
        }
        let ge, he = [{
            countryCode: "AR",
            optOutRegion: "EU"
        }, {
            countryCode: "AU",
            optOutRegion: "AP"
        }, {
            countryCode: "BE",
            optOutRegion: "EU"
        }, {
            countryCode: "BR",
            optOutRegion: "EU"
        }, {
            countryCode: "CA",
            optOutRegion: "US"
        }, {
            countryCode: "FR",
            optOutRegion: "EU"
        }, {
            countryCode: "DE",
            optOutRegion: "EU"
        }, {
            countryCode: "GB",
            optOutRegion: "EU"
        }, {
            countryCode: "IT",
            optOutRegion: "EU"
        }, {
            countryCode: "JP",
            optOutRegion: "AP"
        }, {
            countryCode: "MX",
            optOutRegion: "US"
        }, {
            countryCode: "NL",
            optOutRegion: "EU"
        }, {
            countryCode: "NZ",
            optOutRegion: "AP"
        }, {
            countryCode: "PL",
            optOutRegion: "EU"
        }, {
            countryCode: "RO",
            optOutRegion: "EU"
        }, {
            countryCode: "SG",
            optOutRegion: "AP"
        }, {
            countryCode: "ES",
            optOutRegion: "EU"
        }, {
            countryCode: "TW",
            optOutRegion: "AP"
        }, {
            countryCode: "US",
            optOutRegion: "US"
        }, {
            countryCode: "IN",
            optOutRegion: "AP"
        }, {
            countryCode: "HK",
            optOutRegion: "AP"
        }];
        async function ye(e, t) {
            const n = N("_lr_optout");
            if ("" === n) {
                if (ge) {
                    let t = "https://" + ge + "/publisher/opt-outs";
                    const n = await async function(e, t) {
                        const n = await ce(e + "/" + t);
                        return console.log(n), n
                    }(t, e);
                    return n && n.timestamp ? (U("_lr_optout", n.timestamp, 1296e3), pe(), le(13, n.timestamp) && de("lr-optInEvent"), !0) : !(!n || !n.message) && (U("_lr_optout", "/", 1296e3), !1)
                }
                return !1
            }
            return "/" !== n && (le(13, n) && de("lr-optInEvent"), !0)
        }

        function me(e) {
            e && e.metadata && e.metadata.timestamp && (U("_lr_optout", e.metadata.timestamp, 1296e3), pe())
        }
        const ve = /(^[a-f0-9]{32}$)|(^[a-f0-9]{40}$)|(^[a-f0-9]{64}$)/,
            we = "sha256Email",
            Se = "sha1Email",
            Ce = "md5Email",
            Oe = "phoneNumber",
            Ae = ["cfcd208495d565ef66e7dff9f98764da", "2f43b42fd833d1e77420a8dae7419000", "7215ee9c7d9dc229d2921a40e899ec5f", "3d407cbd539c1f1f4b436169c9f5e1a3", "07e541ee7ffe448eae004c08a59dd91b", "852438d026c018c4307b916406f98c62", "4da8b7eb2c3f2007cf8238334401ef51", "334c4a4c42fdb79d7ebc3e73b517e6f8", "6adf97f83acf6453d4a6a4b1070f3754", "bbb93ef26e3c101ff11cdd21cab08a94", "37a6259cc0c1dae299a7866489dff0bd", "8589033c2cd15744c3ce30d1bddeb087", "93942e96f5acd83e2e047ad8fe03114d", "55502f40dc8b7c769880b10874abc9d0", "1aedb8d9dc4751e229a335e371db8058", "8d89c3087cc6cb98793ab7c0f5658c56", "97dfebf4098c0f5c16bca61e2b76c373", "476869598e748d958e819c180af31982", "ef8ca1c0ff7d2e34dc0953d4222655b8", "eca74378f20815070e1bec3ee81bfabc", "88e478531ab3bc303f1b5da82c2e9bbb", "8c3fe1ad25e6d5f47512ea7365419966", "9ad574806427070b94735f216e9abdc1", "ad16f2226a41423949f2c6d400bbc5d7", "3d751a0c27cbe4cd47f1fe09352c24fb", "799dd2047247877f2da2158fd61e25b6", "348bec5913e8550419c565d84ef92e52", "5beba8117bb43bde25beb24b58412183", "348bec5913e8550419c565d84ef92e52", "5beba8117bb43bde25beb24b58412183", "a18bf786efb76a3d56ee69a3b343952a", "86b5735c643e34006dfc421030e5d211", "5e543256c480ac577d30f76f9120eb74", "ec0fc0100c4fc1ce4eea230c3dc10360", "b58996c504c5638798eb6b511e6f49af", "946003f97ccc52d5d3b54ac0ec31bbfc", "b6589fc6ab0dc82cf12099d1c2d40ab994e8410c", "6eae3a5b062c6d0d79f070c26e6d62486b40cb46", "b858cb282617fb0956d960215c8e84d1ccf909c6", "4cefae8c39427da6c5d65b35f34211656e091b97", "27386f29c24918f7635a238a804215ae154a9d0b", "b5366a2d2ac98dae978423083f8b09e5cddc705d", "c916da70cd4a32512ca71d70e5cc765d00357df4", "71f8e7976e4cbc4561c9d62fb283e7f788202acb", "6eef6648406c333a4035cd5e60d0bf2ecf2606d7", "109085beaaa80ac89858b283a64f7c75d7e5bb12", "2be88ca4242c76e8253ac62474851065032d6833", "7e05143b040cbe5768da6abe82229f08c0f977d5", "f7a36129f691baa1201d963b8537eb69caa28863", "567159d622ffbb50b11b0efd307be358624a26ee", "ea97b75619f5cb2b9df9d184c4541aafe3b87484", "22d002c0a1d1f181dcbd75573e18de5af0eab43d", "52e17b67fd82b0545bb4fbdc5748ed23104133c7", "624ddbfecf6c492001bd3660870958cb84120ff9", "4ad6658bbc6700c113fe12acaa77ebf4d00f7cf5", "1245282959d9e21d2c2033fff63b765b6805b483", "49eb577150e21ee3180224a011edfc310acc3779", "ca7fe1db6188a235dabc9c1457d82e636b11a543", "b9f87d81ccb9795c4a8b82055610334e3881ca80", "dcf608cc7daaf155d54aad5b16f10f102bc2cab7", "0a75e7e26ee11630e8090f43a7a36ab283e7bd79", "2ebc7ba1d181ae807a36734904d5506dae4599d1", "7ee99aec60d570c612b86f417c579ce6c0d28799", "849f789f32f74696f4e5a2e3ca999db468d11cc4", "79cc65d586f548f71229672ca3455a754c13e44d", "e62f22de243201afe4303ebd42984f10f77eb983", "d5d4cd07616a542891b7ec2d0257b3a24b69856e", "0646f4afd90c8fdb87bbcb57b63ee1911f5a9a46", "63a710569261a24b3766275b7000ce8d7b32e2f7", "0ed2d7b5cdb77627bc46c6fac5026ec27b694d42", "5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9", "ab5df625bc76dbd4e163bed2dd888df828f90159bb93556525c31821b6541d46", "36a9e7f1c95b82ffb99743e0c5c4ce95d83c9a430aac59f84ef3cbfab6145068", "c6f62b06b3cd95ac3cc5b6aba2b157283273febc7d62fd3785d9f14737128166", "e40ff7f3a562b8757869d839b578d56390dd68e1cc28bf9b6d5362bc717e1c90", "5da3a4c7f117944275b4c8629c4916403625d5a4a6573a01ecb03f0e9d2edbe6", "e118b5c29cb4b975251601a6cc3209a4ea3eb0b429b205b679a8645da47da654", "140bedbf9c3f6d56a9846d2ba7088798683f4da0c248231336e6a05679e4fdfe", "dc937b59892604f5a86ac96936cd7ff09e25f18ae6b758e8014a24c7fa039e91", "fa1d2db62d4d952e2031452e1bc1ddcad0b192c2e29a706f11ce426ae5acddea", "74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b", "f320794388bf29dabc846c54fe7ff28f78fc3bc3c13748783335a9bf33440d55", "73062d872926c2a556f17b36f50e328ddf9bff9d403939bd14b6c3b7f5a33fc2", "973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b", "87924606b4131a8aceeeae8868531fbb9712aaa07a5d3a756b26ce0f5d6ca674", "f080ca14e0e21e303b60a69e20be89fb3a682f8721b922823fcffcb108bb1363", "f0e2a21bcf499cbc713c47d8f034d66e90a99f9ffcfe96466c9971dfdc5c9816", "f303cf025f54905caca8788d2c7070d47fb49eb6515b7d886d3305a4f10396f9", "1f9e575ad4234c30a81d30c70affd4bba7b0d57d8e8607ad255496863d72c8bb", "587d4c12fef06af41f2fdfa19a3e68443bf8a7923b47cb75022481f8d77552ad", "e85bbf307aedebc91b078f5bc1ebd50d72e7494ffd85f32184688bfd032c3271", "66067ef9e155e39767ab7da916d84ee8ff70efe1459b4c0808fc776d52d85848", "944653ca1e1968fc3f9a0137faad3df546ac6065e1bd95e896ad69200dbe449c", "fe83e987766f25a7132fb9f45bc9620374568405a6a2b9d275d88f5042a8dc9b", "920c46ed756bcc1ea8f70cc90a59584efa6b2b6b5d394ca323dafd5ffce25a4c", "65c85ffcc43d86169bc4cc7c49a71fa505ddf863ba4a2af6cfaf1adbc0fd5d47", "bb8db4111f03c65c52df77d8d6963b7aee7b28bd8fd4eae61ead6e824770490e", "109fe15ff056d9cf6b5f4fa2be71da6db3308190149ae6d5eee2f5905a88fde9", "dae9c7c55697ba170d6b494c458649bd469af525520280d0dcfc98d74d13b17e", "b1bc5cb7473bd88caf80e991de2067f4b00dd25b0923f6c2eb57d18d79391399", "eb045d78d273107348b0300c01d29b7552d622abbc6faf81b3ec55359aa9950c", "f02dfb7da82a40b055700e27ce61e0b3ad10985137f721e7a2c62b3dc3fbaf31", "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514", "4e523a5ae5b4636c75901b79fafbd3912e41dc7987414e688b09d4b436ff22b3"];

        function Ee(e) {
            return ve.test(e) && -1 === Ae.indexOf(e)
        }

        function Pe(e, t) {
            32 === t.length ? e[Ce] = t : 40 === t.length ? B.urlHashType === Oe ? e[Oe] = t : e[Se] = t : 64 === t.length && (e[we] = t)
        }
        async function xe(e) {
            const t = new CustomEvent(e);
            window.dispatchEvent(t)
        }
        const _e = /(^((\+1)?)([\s.-]?)?[(]?[2-9][0-9][0-9][)]?[(\s)?.-]?[2-9][0-9][0-9][\s.-]?\d{4}$)/,
            Te = /(\+1)|[.]|[(]|[)]|[-]|[ ]/gi;
        async function Ie(e) {
            if ("string" != typeof e && (e += ""), function(e) {
                    return _e.test(e.trim(e))
                }(e)) {
                if (R.debug("We detected phone number: " + e), e = function(e) {
                        return e.replace(Te, "")
                    }(e), e = await Z(e), B.pubOptout) {
                    if (await ye(e, B.countryCode)) return R.debug("User has enabled optout. Envelope will be deleted and library will stop."), pe(Re ? B.rootDomain : void 0), "opted_out"
                }
                if (await Je()) return;
                const t = {
                    phoneNumber: e
                };
                R.debug("New Envelope will be acquired."), ke(t, B.placementID)
            } else R.debug("Phone number is invalid")
        }
        const De = "https://api.rlcdn.com/api/identity/v2/envelope";
        let Re = !1;
        async function ke(e, t) {
            const n = B.customerID && B.accountID ? "&it=15&iv=" + B.accountID + ":" + B.customerID : (e.sha256Email ? "&it=4&iv=" + e.sha256Email : "") + (e.sha1Email ? "&it=4&iv=" + e.sha1Email : "") + (e.md5Email ? "&it=4&iv=" + e.md5Email : "") + (e.phoneNumber ? "&it=11&iv=" + e.phoneNumber : ""),
                r = qe(),
                o = De + "?pid=" + t + n + r;
            await Be(o)
        }
        async function Be(e, t) {
            if (B.testMode) {
                const e = "MOCKED_ENVELOPE";
                R.debug("New mocked envelope: ", e);
                Ne(Ue(e))
            } else try {
                const n = await ce(e);
                n && n.envelopes && n.envelopes.length > 0 ? n.envelopes.filter((e => e)).forEach((e => {
                    if (e.type !== ne.LIVERAMP || void 0 !== t && t !== ee.LIVERAMP)
                        if (e.type !== ne.FACEBOOK || void 0 !== t && t !== ee.FACEBOOK) {
                            if (e.type === ne.PAIR_ID && (void 0 === t || t === ee.PAIR_ID) && B.usePAIR) {
                                const t = Ue(JSON.parse(atob(e.value)));
                                R.debug("Encoded PAIR ID envelope: ", JSON.stringify(t)), Ne(t, ee.PAIR_ID)
                            }
                        } else if (e.err) R.error("Facebook envelope error: ", e.err);
                    else if (e.value && "" !== e.value) {
                        const t = Ue(e.value);
                        R.debug("Encoded facebook envelope: ", JSON.stringify(t)), Ne(t, ee.FACEBOOK)
                    } else R.error("Envelope retrieved from API is undefined or empty");
                    else if (e.err) R.error("Liveramp envelope error: ", e.err);
                    else if (e.value && "" !== e.value) {
                        const t = Ue(e.value);
                        R.debug("Encoded liveramp envelope: ", JSON.stringify(t)), Ne(t), B.useESP && Fe()
                    } else R.error("Envelope retrieved from API is undefined or empty")
                })) : R.error("Envelope retrieved from API is undefined or empty")
            } catch (e) {
                R.error("Error from envelope API: ", e)
            } finally {
                We()
            }
        }

        function Ue(e) {
            const t = {
                timestamp: +new Date,
                version: "1.3.0",
                envelope: e
            };
            return btoa(JSON.stringify(t))
        }

        function Ne(e) {
            let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ee.LIVERAMP;
            var n, r;
            "cookie" === B.storageType ? Re ? U(te[t], e, 31536e3, "/", B.rootDomain) : U(te[t], e) : (n = te[t], (r = e) && localStorage.setItem(n, r)), t === ee.LIVERAMP ? xe("lrEnvelopePresent") : t === ee.FACEBOOK ? xe("fbEnvelopePresent") : xe("pairIdEnvelopePresent")
        }
        async function Le() {
            let e;
            const t = Me(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ee.LIVERAMP);
            if (void 0 === t || "" === t) R.debug("There is no envelope in storage.");
            else try {
                JSON.parse(atob(t)).timestamp + 2592e6 < +new Date ? He() : e = atob(t)
            } catch (e) {
                R.error("Envelope is invalid: " + e), He()
            }
            return e
        }
        async function je(e) {
            let t, n, r;
            if (e ? t = await async function(e) {
                    if (Y(e = X(e))) {
                        const t = {
                            sha256Email: await z(e),
                            sha1Email: await Z(e),
                            md5Email: await W(e)
                        };
                        return "" === t.sha1Email && delete t.sha1Email, "" === t.sha256Email && delete t.sha256Email, t
                    }
                }(e): B.emailHashes && (n = function() {
                    const e = {};
                    if (!B.email && B.emailHashes) return B.emailHashes[0] && (Ee(B.emailHashes[0]) ? Pe(e, B.emailHashes[0]) : R.debug(B.emailHashes[0] + " is invalid hash")), B.emailHashes[1] && (Ee(B.emailHashes[1]) ? Pe(e, B.emailHashes[1]) : R.debug(B.emailHashes[1] + " is invalid hash")), B.emailHashes[2] && (Ee(B.emailHashes[2]) ? Pe(e, B.emailHashes[2]) : R.debug(B.emailHashes[2] + " is invalid hash")), JSON.stringify(e) !== JSON.stringify({}) ? (R.debug("At least one hash is valid."), e) : void R.debug("All passed hashes are invalid.")
                }(), n && (t = n)), !t && !B.customerID) return void R.debug("Encrypted Emails are missing!");
            if (-1 === B.placementID && !B.testMode) return void R.debug("PlacementID is set to -1, ATS API wont be called!");
            if (r = B.customerID ? await z(B.customerID) : t.sha256Email, B.pubOptout) {
                if (await ye(r, B.countryCode)) return R.debug("User has enabled optout. Envelope will be deleted and library will stop."), void pe(Re ? B.rootDomain : void 0)
            }
            await Je() || ke(t, B.placementID)
        }
        async function Ve() {
            let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ee.LIVERAMP,
                t = Me(e);
            if (void 0 === t || "" === t) return R.debug(e + " envelope not found in storage! New envelope will be acquired."), "new_envelope";
            try {
                return t = JSON.parse(atob(t)), B.testMode || "MOCKED_ENVELOPE" !== t.envelope ? t.timestamp + B.expirationTime < +new Date ? "new_envelope" : t.timestamp + 2592e6 < +new Date || t.timestamp + B.expirationRefreshTime < +new Date ? "expired" : "not_expired" : (R.debug("Deleting mocked envelope"), He(), "new_envelope")
            } catch (t) {
                return R.error(e + " envelope is invalid: " + t), He(), "new_envelope"
            }
        }

        function Me() {
            let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ee.LIVERAMP;
            if ("cookie" === B.storageType) {
                const t = N(te[e]);
                return navigator.vendor.includes("Apple") && (Re ? U(te[e], t, 31536e3, "/", B.rootDomain) : U(te[e], t)), t
            }
            return function(e) {
                if (null !== localStorage.getItem(e)) return localStorage.getItem(e)
            }(te[e])
        }
        async function He() {
            let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ee.LIVERAMP;
            L(te[e], Re ? B.rootDomain : void 0), j(te[e]), L("_lr_hashed_pid", Re ? B.rootDomain : void 0)
        }
        async function Ke() {
            if (B.pubOptout) {
                const e = N("_lr_hashed_pid");
                if ("" === e) R.debug("There is no saved encrypted identifier.");
                else {
                    R.debug("Encrypted identifier found.");
                    if (await ye(e, B.countryCode)) return R.debug("User has enabled optout. Envelope will be deleted and library will stop."), void pe(Re ? B.rootDomain : void 0);
                    if (await Je()) return
                }
            } else {
                if (await Je()) return
            }
            return ht || !B.startWithExternalId || B.catchIdentifier || B.regManagerMode ? !ht && B.regManagerMode && B.startWithExternalId ? (R.debug("Envelope module is in registration manager mode. Stoping the flow until identifier is passed."), void We()) : (gt = !0, void(B.customerID && B.accountID ? (R.debug("Customer id: ", B.customerID), R.debug("Account id: ", B.accountID), e = B.customerID, B.customerIDRegex && new RegExp(B.customerIDRegex).test(e) ? je() : R.error("CustomerID is not valid!")) : B.email ? (R.debug("Config email: ", B.email), Y(B.email) ? je(B.email) : R.error("Config email is not valid!")) : B.phoneNumber ? (R.debug("Config phone number: ", B.phoneNumber), Ie(B.phoneNumber)) : B.emailHashes ? (R.debug("Config hashes: " + B.emailHashes), je()) : B.catchIdentifier && (We(), R.info("Catching identifier configured."), window.addEventListener("detected-identifier", Ge, !1)))) : (R.debug("Envelope module is in direct mode. Stoping the flow until identifier is passed."), void We());
            var e
        }

        function Ge(e) {
            if (!1 !== pt)
                if (R.debug("Identifier caught from detection:  - ", e.detail.identifier), "email" === e.detail.type) je(e.detail.identifier);
                else if ("phoneNumber" === e.detail.type) Ie(e.detail.identifier);
            else if ("customerID" === e.detail.type) B.accountID = e.detail.identifier.accountId, B.customerID = e.detail.identifier.customerId, je();
            else if ("envelope" === e.detail.type) {
                let t;
                try {
                    t = JSON.parse(e.detail.identifier).envelope
                } catch (n) {
                    t = e.detail.identifier
                }
                Ne(Ue(t))
            } else "SHA256Hash" !== e.detail.type && "SHA1Hash" !== e.detail.type && "MD5Hash" !== e.detail.type || (B.emailHashes = [e.detail.identifier], je());
            else R.debug("No consent has been given, library will shutdown!")
        }
        async function Fe() {
            let e = await Le();
            e && (e = JSON.parse(e), e.envelope && (R.debug("Inserting secure signal provides script."), window.googletag = window.googletag || {
                cmd: []
            }, window.googletag.secureSignalProviders = window.googletag.secureSignalProviders || [], window.googletag.secureSignalProviders.push({
                id: "liveramp.com",
                collectorFunction: () => Promise.resolve(e.envelope)
            })))
        }
        async function Je() {
            const e = [Ve(ee.LIVERAMP), window.fbcapimodule ? Ve(ee.FACEBOOK) : null],
                t = await Promise.all(e);
            let n = !1;
            if (!t.includes("new_envelope")) {
                n = !0;
                let e = "";
                if (t[0] && "expired" === t[0] && (R.debug("LR envelope has expired!"), e = $e(e, ee.LIVERAMP)), t[0] && "not_expired" === t[0]) {
                    R.debug("LR envelope did not expire!"), xe("lrEnvelopePresent");
                    const e = Me(ee.PAIR_ID);
                    if (e && "" !== e) {
                        const t = JSON.parse(atob(e)).envelope;
                        t && t.length > 0 && xe("pairIdEnvelopePresent")
                    }
                }
                t[1] && "expired" === t[1] && (R.debug("FB envelope has expired!"), e = $e(e, ee.FACEBOOK)), t[1] && "not_expired" === t[1] && (R.debug("FB envelope did not expire!"), xe("fbEnvelopePresent")), e && (e += qe(), await Be(e))
            }
            return n
        }

        function $e(e, t) {
            let n = Me(t);
            return n = JSON.parse(atob(n)).envelope, 0 === e.length ? e = De + "/refresh?pid=" + B.placementID + "&it=" + ne[t] + "&iv=" + n : e += "&it=" + ne[t] + "&iv=" + n, e
        }

        function qe() {
            return (B.ccpaConsentString ? "&ct=3&cv=" + encodeURIComponent(B.ccpaConsentString) : "") + (B.gdprConsentString ? "&ct=4&cv=" + B.gdprConsentString : "") + (B.gppConsentString ? "&gpp=" + B.gppConsentString + "&gpp_sid=" + B.gppSectionId : "")
        }

        function We() {
            wt || (wt = !0, R.info("Envelope-module is configured."), xe("envelopeModuleReady"))
        }
        var ze = n(3178);
        const Ze = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB"],
            Xe = 97,
            Ye = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        function Qe(e) {
            if (!e) return;
            const t = function(e) {
                try {
                    return new ze.TCStringV2(e)
                } catch (e) {
                    console.error("Failed to decode consent string: " + e)
                }
            }(e);
            return void 0 !== t ? function(e) {
                if (!e.core || -1 === e.core.vendorsConsent.indexOf(Xe)) return !1;
                for (let t = 0; t < Ye.length; t++)
                    if (-1 === e.core.purposesConsent.indexOf(Ye[t])) return !1;
                return !0
            }(t) : void 0
        }

        function et(e) {
            const t = "" + N("_lr_geo_location_state");
            let n = tt,
                r = "usnat",
                o = "US National";
            switch (t) {
                case "CA":
                    n = nt, r = "usca", o = "California";
                    break;
                case "VA":
                    n = rt, r = "usva", o = "Virginia";
                    break;
                case "CO":
                    n = ot, r = "usco", o = "Colorado";
                    break;
                case "UT":
                    n = it, r = "usut", o = "Utah";
                    break;
                case "CT":
                    n = at, r = "usct", o = "Connecticut";
                    break;
                default:
                    n = tt, r = "usnat", o = "US National"
            }
            let i = __gpp("getSection", null, r);
            if (void 0 === i) R.debug("GPP getSection gppEvaluateConsentFunction " + o + " implementation!"), __gpp("getSection", (t => {
                "usnat" !== r && (null === t || 0 === t.length || null === t[0]) ? (R.debug(`GPP consent for ${o} not provided.`), __gpp("getSection", (t => {
                    tt(t, e)
                }), "usnat")) : n(t, e)
            }), r);
            else if (R.debug("GPP getSection immediately return value " + o + " implementation!"), "usnat" !== r)
                if (null === i || 0 === i.length || null === i[0]) {
                    tt(__gpp("getSection", null, "usnat"), e)
                } else n(i, e);
            else n(i, e)
        }

        function tt(e, t) {
            let n = !1;
            if (null === e || 0 === e.length || null === e[0]) R.debug("GPP consent for US National not provided."), t(null, re.USNAT);
            else {
                if (R.debug(`Checking GPP for US National: ${JSON.stringify(e)}`), e.length) {
                    const t = !(!e[1] || !e[1].Gpc) && e[1].Gpc;
                    (e = e[0]).Gpc = t
                }
                n = e && 1 === e.SharingNotice && 1 === e.SaleOptOutNotice && 1 === e.SharingOptOutNotice && 1 === e.TargetedAdvertisingOptOutNotice && (0 === e.SensitiveDataProcessingOptOutNotice || 1 === e.SensitiveDataProcessingOptOutNotice) && (0 === e.SensitiveDataLimitUseNotice || 1 === e.SensitiveDataLimitUseNotice) && 2 === e.SaleOptOut && 2 === e.SharingOptOut && 2 === e.TargetedAdvertisingOptOut && "[0,0,0,0,0,0,0,0,0,0,0,0]" === JSON.stringify(e.SensitiveDataProcessing) && "[0,0]" === JSON.stringify(e.KnownChildSensitiveDataConsents) && (0 === e.PersonalDataConsents || 2 === e.PersonalDataConsents) && !1 == !!e.Gpc, t(n, re.USNAT)
            }
        }

        function nt(e, t) {
            let n = !1;
            if (R.debug(`Checking GPP for California: ${JSON.stringify(e)}`), e.length) {
                const t = !(!e[1] || !e[1].Gpc) && e[1].Gpc;
                (e = e[0]).Gpc = t
            }
            n = e && 1 === e.SaleOptOutNotice && 1 === e.SharingOptOutNotice && (0 === e.SensitiveDataLimitUseNotice || 1 === e.SensitiveDataLimitUseNotice) && 2 === e.SaleOptOut && 2 === e.SharingOptOut && "[0,0,0,0,0,0,0,0,0]" === JSON.stringify(e.SensitiveDataProcessing) && "[0,0]" === JSON.stringify(e.KnownChildSensitiveDataConsents) && (0 === e.PersonalDataConsents || 2 === e.PersonalDataConsents) && !1 == !!e.Gpc, t(n, re.USCA)
        }

        function rt(e, t) {
            let n = !1;
            if (R.debug(`Checking GPP for Virginia: ${JSON.stringify(e)}`), e.length) {
                const t = !(!e[1] || !e[1].Gpc) && e[1].Gpc;
                (e = e[0]).Gpc = t
            }
            n = e && 1 === e.SharingNotice && 1 === e.SaleOptOutNotice && 1 === e.TargetedAdvertisingOptOutNotice && 2 === e.SaleOptOut && 2 === e.TargetedAdvertisingOptOut && "[0,0,0,0,0,0,0,0]" === JSON.stringify(e.SensitiveDataProcessing) && 0 === e.KnownChildSensitiveDataConsents && !1 == !!e.Gpc, t(n, re.USVA)
        }

        function ot(e, t) {
            let n = !1;
            if (R.debug(`Checking GPP for Colorado: ${JSON.stringify(e)}`), e.length) {
                const t = !(!e[1] || !e[1].Gpc) && e[1].Gpc;
                (e = e[0]).Gpc = t
            }
            n = e && 1 === e.SharingNotice && 1 === e.SaleOptOutNotice && 1 === e.TargetedAdvertisingOptOutNotice && 2 === e.SaleOptOut && 2 === e.TargetedAdvertisingOptOut && "[0,0,0,0,0,0,0]" === JSON.stringify(e.SensitiveDataProcessing) && 0 === e.KnownChildSensitiveDataConsents && !1 == !!e.Gpc, t(n, re.USCO)
        }

        function it(e, t) {
            let n = !1;
            if (R.debug(`Checking GPP for Utah: ${JSON.stringify(e)}`), e.length) {
                const t = !(!e[1] || !e[1].Gpc) && e[1].Gpc;
                (e = e[0]).Gpc = t
            }
            n = e && 1 === e.SharingNotice && 1 === e.SaleOptOutNotice && 1 === e.TargetedAdvertisingOptOutNotice && (0 === e.SensitiveDataProcessingOptOutNotice || 1 === e.SensitiveDataProcessingOptOutNotice) && 2 === e.SaleOptOut && 2 === e.TargetedAdvertisingOptOut && "[0,0,0,0,0,0,0,0]" === JSON.stringify(e.SensitiveDataProcessing) && 0 === e.KnownChildSensitiveDataConsents && !1 == !!e.Gpc, t(n, re.USUT)
        }

        function at(e, t) {
            let n = !1;
            if (R.debug(`Checking GPP for Connecticut: ${JSON.stringify(e)}`), e.length) {
                const t = !(!e[1] || !e[1].Gpc) && e[1].Gpc;
                (e = e[0]).Gpc = t
            }
            n = e && 1 === e.SharingNotice && 1 === e.SaleOptOutNotice && 1 === e.TargetedAdvertisingOptOutNotice && 2 === e.SaleOptOut && 2 === e.TargetedAdvertisingOptOut && "[0,0,0,0,0,0,0,0]" === JSON.stringify(e.SensitiveDataProcessing) && "[0,0,0]" === JSON.stringify(e.KnownChildSensitiveDataConsents) && !1 == !!e.Gpc, t(n, re.USCT)
        }

        function st() {
            if (R.info("Location of the user is in country that has GDPR regulation!"), !0 === mt) return R.debug("TCF library is loaded."), void(!0 === pt ? (R.debug("Consent has been given, library will start!"), Ke()) : (pe(Re ? B.rootDomain : void 0), R.debug("Consent was rejected. Envelope will be removed and library will shutdown!")));
            window.__tcfapi && !mt && (mt = !0, __tcfapi("addEventListener", 2, ((e, t) => {
                try {
                    if (t && "tcloaded" === e.eventStatus) {
                        const t = Qe(e.tcString);
                        if (void 0 === t) throw "Failed to get consent data. Library will shutdown!";
                        if (!1 === t) throw "Consent was rejected. Envelope will be removed and library will shutdown!";
                        !0 === t && (B.gdprConsentString = e.tcString, R.debug("Consent has been given, library will start!"), bt(!0), Ke())
                    } else if (t && "useractioncomplete" === e.eventStatus) {
                        R.debug("User changed consent data!");
                        const t = Qe(e.tcString);
                        if (void 0 === t) throw "Failed to get consent data. Library will shutdown!";
                        if (!1 === t) throw "Consent was rejected. Envelope will be removed and library will shutdown!";
                        !0 === t && (bt(!0), B.gdprConsentString = e.tcString, R.debug("Consent has been given, library will start!"), gt || Ke())
                    }
                } catch (e) {
                    pe(Re ? B.rootDomain : void 0), bt(!1), R.debug(e)
                }
            })))
        }

        function ct() {
            R.debug("User is in the US"), window.__gpp ? function(e) {
                let t = 0;
                const n = setInterval((r => {
                    if (++t, t > oe) clearInterval(n), R.debug("GPP library didn't load in time."), e(null);
                    else {
                        const t = __gpp("ping");
                        R.debug("Check if GPP library is loaded?"), t && "loaded" === t.cmpStatus ? (R.debug("GPP library fully loaded."), clearInterval(n), et(e)) : __gpp("ping", (t => {
                            t && "loaded" === t.cmpStatus && (R.debug("GPP library fully loaded."), clearInterval(n), et(e))
                        }))
                    }
                }), 200)
            }(lt) : window.__uspapi ? ut() : Ke()
        }

        function ut() {
            R.debug("CCPA library is present"), __uspapi("getUSPData", 1, ((e, t) => {
                if (null === e.uspString) return R.debug("User did not interact with consent manager."), Ke();
                t ? ! function(e, t, n, r) {
                    if (4 !== e.length) return r("CCPA consent string is not 4 characters long!"), !1;
                    const o = e.split("")[2];
                    return "Y" === o ? (n("User didn't give consent. Library will shut down."), t.ccpaConsentString = void 0, !1) : ("N" === o ? (n("User gave consent"), t.ccpaConsentString = e) : "-" === o && (n("CCPA doesnt apply to this user"), t.ccpaConsentString = void 0), !0)
                }(e.uspString, B, R.debug, R.error) ? (R.debug("No consent has been given, envelope will be removed and library will shutdown!"), pe(Re ? B.rootDomain : void 0)) : Ke() : (R.debug("No consent has been given, envelope will be removed and library will shutdown!"), pe(Re ? B.rootDomain : void 0))
            }))
        }

        function dt(e) {
            if (B.expirationTime = 2592e6, "US" === e) {
                "CA" === N("_lr_geo_location_state") && (B.expirationTime = 1296e6), B.gdprConsentString = void 0, ct()
            } else ! function(e) {
                return Ze.includes(e)
            }(e) ? (R.info("Location of the user is NOT in country that has GDPR or CCPA regulation!"), B.ccpaConsentString = void 0, B.gdprConsentString = void 0, B.gppConsentString = void 0, Ke()) : (B.ccpaConsentString = void 0, B.gppConsentString = void 0, st())
        }

        function lt(e, t) {
            if (B.gppSectionId = t, B.gppConsentString = void 0, null === e || vt || (__gpp("addEventListener", ft), vt = !0), !0 === e) {
                let e = __gpp("getGPPData");
                e ? (R.debug("Gpp getGPPData return immediately value implementation"), B.gppConsentString = e.gppString, Ke()) : (__gpp("getGPPData", (e => {
                    R.debug("Gpp getGPPData callback implementation"), B.gppConsentString = e.gppString, Ke()
                })), __gpp("ping", (e => {
                    e && e.gppString && e.gppString.length > 0 && (R.debug("Gpp ping callback implementation"), B.gppConsentString = e.gppString, Ke())
                })))
            } else !1 === e ? (R.debug("User didn't give consent. Library will shut down."), pe(Re ? B.rootDomain : void 0)) : window.__uspapi ? ut() : Ke()
        }
        const ft = e => {
            "sectionChange" === e.eventName && (R.debug(`[GPP] event listener invocked with ${JSON.stringify(e)}`), et(((e, t) => {
                if (!0 === e || null === e) {
                    if (R.debug("Consent has been given, library will start!"), bt(!0), !gt) {
                        B.gppSectionId = t;
                        let e = __gpp("getGPPData");
                        e ? (R.debug("Gpp getGPPData return immediately value implementation"), B.gppConsentString = e.gppString, Ke()) : (__gpp("getGPPData", (e => {
                            R.debug("Gpp getGPPData callback implementation"), B.gppConsentString = e.gppString, Ke()
                        })), __gpp("ping", (e => {
                            e && e.gppString && e.gppString.length > 0 && (R.debug("Gpp ping callback implementation"), B.gppConsentString = e.gppString, Ke())
                        })))
                    }
                } else R.debug("Consent was rejected. Library will shutdown!"), B.gppSectionId = void 0, B.gppConsentString = void 0, bt(!1), pe(Re ? B.rootDomain : void 0)
            })))
        };
        let pt;

        function bt(e) {
            pt = e
        }
        let gt = !1;
        let ht = !1;

        function yt(e) {
            ht = e
        }
        let mt = !1;
        let vt = !1;
        let wt = !1;
        async function St(e) {
            return B.update(e), B.gdprConsentString = void 0, B.ccpaConsentString = void 0, B.gppConsentString = void 0,
                function(e, t) {
                    e.testMode || e.testEventCode ? (e.logging = "debug", I(e.logging, t), R.debug("Test mode enabled.")) : I(e.logging, t);
                    try {
                        const n = new URL(window.location.href).searchParams.get("ats_debug");
                        "true" === n ? (e.logging = "debug", I(e.logging, t), R.debug("Debug mode enabled.")) : "false" === n && (R.debug("Debug mode disabled."), e.logging = "info", I(e.logging, t))
                    } catch (e) {
                        R.debug("Creating URL object failed: " + e)
                    }
                }(B, "(ATS-ENVELOPE-MODULE)"), window.navigator.globalPrivacyControl ? (R.debug("GPC is enabled. Envelope will be deleted and envelope module will shutdown."), void pe(Re ? B.rootDomain : void 0)) : function() {
                    const e = window.doNotTrack || window.navigator.doNotTrack || window.navigator.msDoNotTrack;
                    return !!e && ("1" === e.charAt(0) || "yes" === e)
                }() ? (R.debug("Do Not Track is enabled. Envelope will be deleted and envelope module will shutdown."), void pe(Re ? B.rootDomain : void 0)) : (B.rootDomain && function(e, t) {
                    let n = e.split("."),
                        r = t.split(".");
                    for (let e = n.length - 1, t = r.length - 1; e > -1; e--, t--)
                        if (n[e] !== r[t]) return void R.error("Passed root domain is invalid!");
                    Re = !0
                }(B.rootDomain, window.location.hostname), window.addEventListener("message", Ot, !1), window.addEventListener("message", At, !1), R.debug("ats-set-additional-data event set up."), B.useESP && Fe(), void Ct())
        }
        async function Ct() {
            const e = await ue();
            B.countryCode = e,
                function(e) {
                    let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : he,
                        n = arguments.length > 2 ? arguments[2] : void 0;
                    for (let r in t) t[r].countryCode === e && (ge = n.find((e => e.includes(t[r].optOutRegion.toLowerCase()))))
                }(e, B.placementCountries, B.configUrlList), dt(e)
        }
        async function Ot(e) {
            if (e && e.source && e.data && "ats-modules-liveramp-envelope-request" === e.data) {
                let t = await Le();
                t ? (e.source.postMessage({
                    message: "ats-modules-liveramp-envelope-result",
                    result: t
                }, "*"), R.debug("ats-modules-liveramp-envelope-result postMessage dispatched!")) : (e.source.postMessage({
                    message: "ats-modules-liveramp-envelope-result",
                    result: void 0
                }, "*"), R.debug("There is no envelope!"))
            }
        }
        async function At(e) {
            e && e.type && "message" === e.type && e.data && e.data["ats-set-additional-data"] && e.data["ats-set-additional-data"].detail && "set-additional-data" === e.data["ats-set-additional-data"].detail.eventName && e.data["ats-set-additional-data"].detail.identifier && (R.debug("setAdditionalDataEvent received data."), B.email = e.data["ats-set-additional-data"].detail.identifier, await be(B.email, "email", B.pubOptout), yt(!0), Ct())
        }
        const Et = n(4147);

        function Pt(e) {
            St(e)
        }

        function xt(e) {
            !async function(e) {
                if (R.info("START setAdditionalData FUNCTION!"), e && e.id && e.type)
                    if (!1 !== pt) {
                        if (e.type && e.id) {
                            if (!B.startWithExternalId) return void R.error("The startWithExternalId flag is set to false");
                            switch (e.type) {
                                case "email":
                                    B.email = e.id, await be(e.id, e.type, B.pubOptout);
                                    break;
                                case "phoneNumber":
                                    B.phoneNumber = e.id, await be(e.id, e.type, B.pubOptout);
                                    break;
                                case "emailHashes":
                                    B.emailHashes = e.id, await be(e.id, e.type, B.pubOptout);
                                    break;
                                case "customerID":
                                    B.customerID = e.id, await be(e.id, e.type, B.pubOptout);
                                    break;
                                default:
                                    return void R.error(`The "${e.type}" value of type parameter is not in right format. Has to be one of: email, phoneNumber, emailHashes or customerID`)
                            }
                        }
                        yt(!0), Ct()
                    } else R.debug("Consent was not given. Passing identifier will not be allowed.");
                else R.error("Data object is empty")
            }(e)
        }
        async function _t(e) {
            let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ee.LIVERAMP,
                n = Object.values(te).indexOf(t); - 1 !== n && (t = Object.keys(ee)[n]);
            const r = await Le(t);
            return e ? e(r) : r
        }

        function Tt(e) {
            const t = {
                ENVELOPE_MODULE_VERSION: Et.version,
                ENVELOPE_MODULE_CONFIG: JSON.parse(JSON.stringify(B))
            };
            if (!e) return t;
            e(t)
        }

        function It() {
            He(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ee.LIVERAMP)
        }

        function Dt(e, t) {
            !async function(e, t, n) {
                let r = "";
                if (!n.pubOptout) return void console.error("ATS: Pub opt out disabled");
                if (!ge) return void console.error("ATS: Missing opt-out url!");
                let o = "https://" + ge + "/publisher/opt-outs";
                switch (t) {
                    case "email":
                    case "customerID":
                        return r = await fe(o, {
                            opt_out_id: await z(e)
                        }), void me(r);
                    case "phoneNumber":
                        return r = await fe(o, {
                            opt_out_id: await Z(e)
                        }), void me(r);
                    case "hash":
                        r = await fe(o, {
                            opt_out_id: e
                        }), me(r)
                }
            }(e, t, B)
        }

        function Rt() {
            !async function(e) {
                if (!e.pubOptout) return void console.error("ATS: Pub opt out disabled");
                let t = "https://" + ge + "/publisher/opt-outs",
                    n = N("_lr_hashed_pid");
                n ? me(await fe(t, {
                    opt_out_id: n
                })) : console.info("ATS: Missing identifier in storage!")
            }(B)
        }
    }(), window.atsenvelopemodule = r
}();
window.atsenvelopemodule.start({
    "placementID": "14006",
    "storageType": "cookie",
    "logging": "errors",
    "regManagerMode": false,
    "accountID": "-1",
    "catchIdentifier": false,
    "startWithExternalId": true,
    "testMode": false,
    "useESP": true,
    "usePAIR": false,
    "placementCountries": [{
        "checked": false,
        "countryName": "USA",
        "optOutRegion": "US",
        "countryCode": "US"
    }, {
        "checked": false,
        "countryName": "Italy",
        "optOutRegion": "EU",
        "countryCode": "IT"
    }, {
        "checked": false,
        "countryName": "Brazil",
        "optOutRegion": "EU",
        "countryCode": "BR"
    }, {
        "checked": false,
        "countryName": "Great Britain",
        "optOutRegion": "EU",
        "countryCode": "GB"
    }, {
        "checked": false,
        "countryName": "Indonesia",
        "optOutRegion": "AP",
        "countryCode": "ID"
    }, {
        "checked": false,
        "countryName": "Japan",
        "optOutRegion": "AP",
        "countryCode": "JP"
    }, {
        "checked": false,
        "countryName": "Mexico",
        "optOutRegion": "US",
        "countryCode": "MX"
    }, {
        "checked": false,
        "countryName": "Argentina",
        "optOutRegion": "EU",
        "countryCode": "AR"
    }, {
        "checked": false,
        "countryName": "Belgium",
        "optOutRegion": "EU",
        "countryCode": "BE"
    }, {
        "checked": false,
        "countryName": "Australia",
        "optOutRegion": "AP",
        "countryCode": "AU"
    }, {
        "checked": false,
        "countryName": "Romania",
        "optOutRegion": "EU",
        "countryCode": "RO"
    }, {
        "checked": false,
        "countryName": "Netherlands",
        "optOutRegion": "EU",
        "countryCode": "NL"
    }, {
        "checked": false,
        "countryName": "Germany",
        "optOutRegion": "EU",
        "countryCode": "DE"
    }, {
        "checked": false,
        "countryName": "Singapore",
        "optOutRegion": "AP",
        "countryCode": "SG"
    }, {
        "checked": false,
        "countryName": "Hong Kong",
        "optOutRegion": "AP",
        "countryCode": "HK"
    }, {
        "checked": false,
        "countryName": "Taiwan",
        "optOutRegion": "AP",
        "countryCode": "TW"
    }, {
        "checked": false,
        "countryName": "France",
        "optOutRegion": "EU",
        "countryCode": "FR"
    }, {
        "checked": false,
        "countryName": "Spain",
        "optOutRegion": "EU",
        "countryCode": "ES"
    }, {
        "checked": false,
        "countryName": "Poland",
        "optOutRegion": "EU",
        "countryCode": "PL"
    }, {
        "checked": false,
        "countryName": "Canada",
        "optOutRegion": "US",
        "countryCode": "CA"
    }, {
        "checked": false,
        "countryName": "New Zealand",
        "optOutRegion": "AP",
        "countryCode": "NZ"
    }],
    "pubOptout": false
});
window.ats = {}, window.ats.LIB_GENERATED_TIMESTAMP = +new Date, window.ats.setAdditionalData = function(e) {
    window.atsdropmatchpixelmodule && window.atsdropmatchpixelmodule.setAdditionalData(e), window.atsenvelopemodule && window.atsenvelopemodule.setAdditionalData(e)
}, window.ats.retrieveEnvelope = function(e, t = "_lr_env") {
    if (window.atsenvelopemodule) return window.atsenvelopemodule.retrieveEnvelope(e, t)
}, window.ats.setOptOut = function(e, t) {
    return window.atsenvelopemodule ? window.atsenvelopemodule.setOptOut(e, t) : window.atsdropmatchpixelmodule ? window.atsdropmatchpixelmodule.setOptOut(e, t) : void 0
}, window.ats.setOptOutStateBasedOnStoredIdentifier = function() {
    return window.atsenvelopemodule ? window.atsenvelopemodule.setOptOutStateBasedOnStoredIdentifier() : window.atsdropmatchpixelmodule ? window.atsdropmatchpixelmodule.setOptOutStateBasedOnStoredIdentifier() : void 0
}, window.ats.outputCurrentConfiguration = function(e) {
    var t = {};
    return window.atsdropmatchpixelmodule && (t.DROP_MATCH_PIXEL_MODULE_INFO = window.atsdropmatchpixelmodule.outputCurrentConfiguration()), window.atsenvelopemodule && (t.ENVELOPE_MODULE_INFO = window.atsenvelopemodule.outputCurrentConfiguration()), window.atsdetectionmodule && (t.DETECTION_MODULE_INFO = window.atsdetectionmodule.outputCurrentConfiguration()), window.fbcapimodule && (t.FBCAPI_MODULE_INFO = window.fbcapimodule.outputCurrentConfiguration()), window.atsdirectmodule && (t.DIRECT_MODULE_INFO = window.atsdirectmodule.outputCurrentConfiguration()), t.LIB_GENERATED_TIMESTAMP = window.ats.LIB_GENERATED_TIMESTAMP, e ? e(t) : t
}, window.ats.triggerDetection = function() {
    window.atsdetectionmodule && window.atsdetectionmodule.triggerDetection()
}, window.ats.invalidateEnvelope = function() {
    console.log("[GODMODE] CALL TO INVALIDATE CALLED BY PUBLISHER")
    window.atsenvelopemodule && window.atsenvelopemodule.invalidateEnvelope()
}, window.ats.sendFbEvents = function(e) {
    window.fbcapimodule && window.fbcapimodule.sendFbEvents(e)
}, window.ats.getSegmentsData = async function() {
    if (window.atsdirectmodule) return window.atsdirectmodule.getSegmentsData()
}, window.ats.invalidateCachedSegments = function() {
    if (window.atsdirectmodule) return window.atsdirectmodule.invalidateCachedSegments()
};


console.log("[GODMODE] I SEE ALL")
