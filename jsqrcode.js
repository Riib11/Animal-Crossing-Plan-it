GridSampler = {};
GridSampler.checkAndNudgePoints = function(e, r) {
    var t = qrcode.width;
    var n = qrcode.height;
    var i = true;
    for (var a = 0; a < r.length && i; a += 2) {
        var o = Math.floor(r[a]);
        var s = Math.floor(r[a + 1]);
        if (o<-1 || o > t || s<-1 || s > n) {
            throw "Error.checkAndNudgePoints "
        }
        i = false;
        if (o==-1) {
            r[a] = 0;
            i = true
        } else if (o == t) {
            r[a] = t - 1;
            i = true
        }
        if (s==-1) {
            r[a + 1] = 0;
            i = true
        } else if (s == n) {
            r[a + 1] = n - 1;
            i = true
        }
    }
    i = true;
    for (var a = r.length - 2; a >= 0 && i; a -= 2) {
        var o = Math.floor(r[a]);
        var s = Math.floor(r[a + 1]);
        if (o<-1 || o > t || s<-1 || s > n) {
            throw "Error.checkAndNudgePoints "
        }
        i = false;
        if (o==-1) {
            r[a] = 0;
            i = true
        } else if (o == t) {
            r[a] = t - 1;
            i = true
        }
        if (s==-1) {
            r[a + 1] = 0;
            i = true
        } else if (s == n) {
            r[a + 1] = n - 1;
            i = true
        }
    }
};
GridSampler.sampleGrid3 = function(e, r, t) {
    var n = new BitMatrix(r);
    var i = new Array(r<<1);
    for (var a = 0; a < r; a++) {
        var o = i.length;
        var s = a + .5;
        for (var h = 0; h < o; h += 2) {
            i[h] = (h>>1) + .5;
            i[h + 1] = s
        }
        t.transformPoints1(i);
        GridSampler.checkAndNudgePoints(e, i);
        try {
            for (var h = 0; h < o; h += 2) {
                var l = Math.floor(i[h]) * 4 + Math.floor(i[h + 1]) * qrcode.width * 4;
                var c = e[Math.floor(i[h]) + qrcode.width * Math.floor(i[h + 1])];
                qrcode.imagedata.data[l] = c ? 255 : 0;
                qrcode.imagedata.data[l + 1] = c ? 255 : 0;
                qrcode.imagedata.data[l + 2] = 0;
                qrcode.imagedata.data[l + 3] = 255;
                if (c)
                    n.set_Renamed(h>>1, a)
                }
        } catch (f) {
            throw "Error.checkAndNudgePoints"
        }
    }
    return n
};
GridSampler.sampleGridx = function(e, r, t, n, i, a, o, s, h, l, c, f, w, d, u, C, E, v) {
    var B = PerspectiveTransform.quadrilateralToQuadrilateral(t, n, i, a, o, s, h, l, c, f, w, d, u, C, E, v);
    return GridSampler.sampleGrid3(e, r, B)
};
function ECB(e, r) {
    this.count = e;
    this.dataCodewords = r;
    this.__defineGetter__("Count", function() {
        return this.count
    });
    this.__defineGetter__("DataCodewords", function() {
        return this.dataCodewords
    })
}
function ECBlocks(e, r, t) {
    this.ecCodewordsPerBlock = e;
    if (t)
        this.ecBlocks = new Array(r, t);
    else 
        this.ecBlocks = new Array(r);
    this.__defineGetter__("ECCodewordsPerBlock", function() {
        return this.ecCodewordsPerBlock
    });
    this.__defineGetter__("TotalECCodewords", function() {
        return this.ecCodewordsPerBlock * this.NumBlocks
    });
    this.__defineGetter__("NumBlocks", function() {
        var e = 0;
        for (var r = 0; r < this.ecBlocks.length; r++) {
            e += this.ecBlocks[r].length
        }
        return e
    });
    this.getECBlocks = function() {
        return this.ecBlocks
    }
}
function Version(e, r, t, n, i, a) {
    this.versionNumber = e;
    this.alignmentPatternCenters = r;
    this.ecBlocks = new Array(t, n, i, a);
    var o = 0;
    var s = t.ECCodewordsPerBlock;
    var h = t.getECBlocks();
    for (var l = 0; l < h.length; l++) {
        var c = h[l];
        o += c.Count * (c.DataCodewords + s)
    }
    this.totalCodewords = o;
    this.__defineGetter__("VersionNumber", function() {
        return this.versionNumber
    });
    this.__defineGetter__("AlignmentPatternCenters", function() {
        return this.alignmentPatternCenters
    });
    this.__defineGetter__("TotalCodewords", function() {
        return this.totalCodewords
    });
    this.__defineGetter__("DimensionForVersion", function() {
        return 17 + 4 * this.versionNumber
    });
    this.buildFunctionPattern = function() {
        var e = this.DimensionForVersion;
        var r = new BitMatrix(e);
        r.setRegion(0, 0, 9, 9);
        r.setRegion(e - 8, 0, 8, 9);
        r.setRegion(0, e - 8, 9, 8);
        var t = this.alignmentPatternCenters.length;
        for (var n = 0; n < t; n++) {
            var i = this.alignmentPatternCenters[n] - 2;
            for (var a = 0; a < t; a++) {
                if (n == 0 && (a == 0 || a == t - 1) || n == t - 1 && a == 0) {
                    continue
                }
                r.setRegion(this.alignmentPatternCenters[a] - 2, i, 5, 5)
            }
        }
        r.setRegion(6, 9, 1, e - 17);
        r.setRegion(9, 6, e - 17, 1);
        if (this.versionNumber > 6) {
            r.setRegion(e - 11, 0, 3, 6);
            r.setRegion(0, e - 11, 6, 3)
        }
        return r
    };
    this.getECBlocksForLevel = function(e) {
        return this.ecBlocks[e.ordinal()]
    }
}
Version.VERSION_DECODE_INFO = new Array(31892, 34236, 39577, 42195, 48118, 51042, 55367, 58893, 63784, 68472, 70749, 76311, 79154, 84390, 87683, 92361, 96236, 102084, 102881, 110507, 110734, 117786, 119615, 126325, 127568, 133589, 136944, 141498, 145311, 150283, 152622, 158308, 161089, 167017);
Version.VERSIONS = buildVersions();
Version.getVersionForNumber = function(e) {
    if (e < 1 || e > 40) {
        throw "ArgumentException"
    }
    return Version.VERSIONS[e - 1]
};
Version.getProvisionalVersionForDimension = function(e) {
    if (e%4 != 1) {
        throw "Error getProvisionalVersionForDimension"
    }
    try {
        return Version.getVersionForNumber(e - 17>>2)
    } catch (r) {
        throw "Error getVersionForNumber"
    }
};
Version.decodeVersionInformation = function(e) {
    var r = 4294967295;
    var t = 0;
    for (var n = 0; n < Version.VERSION_DECODE_INFO.length; n++) {
        var i = Version.VERSION_DECODE_INFO[n];
        if (i == e) {
            return this.getVersionForNumber(n + 7)
        }
        var a = FormatInformation.numBitsDiffering(e, i);
        if (a < r) {
            t = n + 7;
            r = a
        }
    }
    if (r <= 3) {
        return this.getVersionForNumber(t)
    }
    return null
};
function buildVersions() {
    return new Array(new Version(1, new Array, new ECBlocks(7, new ECB(1, 19)), new ECBlocks(10, new ECB(1, 16)), new ECBlocks(13, new ECB(1, 13)), new ECBlocks(17, new ECB(1, 9))), new Version(2, new Array(6, 18), new ECBlocks(10, new ECB(1, 34)), new ECBlocks(16, new ECB(1, 28)), new ECBlocks(22, new ECB(1, 22)), new ECBlocks(28, new ECB(1, 16))), new Version(3, new Array(6, 22), new ECBlocks(15, new ECB(1, 55)), new ECBlocks(26, new ECB(1, 44)), new ECBlocks(18, new ECB(2, 17)), new ECBlocks(22, new ECB(2, 13))), new Version(4, new Array(6, 26), new ECBlocks(20, new ECB(1, 80)), new ECBlocks(18, new ECB(2, 32)), new ECBlocks(26, new ECB(2, 24)), new ECBlocks(16, new ECB(4, 9))), new Version(5, new Array(6, 30), new ECBlocks(26, new ECB(1, 108)), new ECBlocks(24, new ECB(2, 43)), new ECBlocks(18, new ECB(2, 15), new ECB(2, 16)), new ECBlocks(22, new ECB(2, 11), new ECB(2, 12))), new Version(6, new Array(6, 34), new ECBlocks(18, new ECB(2, 68)), new ECBlocks(16, new ECB(4, 27)), new ECBlocks(24, new ECB(4, 19)), new ECBlocks(28, new ECB(4, 15))), new Version(7, new Array(6, 22, 38), new ECBlocks(20, new ECB(2, 78)), new ECBlocks(18, new ECB(4, 31)), new ECBlocks(18, new ECB(2, 14), new ECB(4, 15)), new ECBlocks(26, new ECB(4, 13), new ECB(1, 14))), new Version(8, new Array(6, 24, 42), new ECBlocks(24, new ECB(2, 97)), new ECBlocks(22, new ECB(2, 38), new ECB(2, 39)), new ECBlocks(22, new ECB(4, 18), new ECB(2, 19)), new ECBlocks(26, new ECB(4, 14), new ECB(2, 15))), new Version(9, new Array(6, 26, 46), new ECBlocks(30, new ECB(2, 116)), new ECBlocks(22, new ECB(3, 36), new ECB(2, 37)), new ECBlocks(20, new ECB(4, 16), new ECB(4, 17)), new ECBlocks(24, new ECB(4, 12), new ECB(4, 13))), new Version(10, new Array(6, 28, 50), new ECBlocks(18, new ECB(2, 68), new ECB(2, 69)), new ECBlocks(26, new ECB(4, 43), new ECB(1, 44)), new ECBlocks(24, new ECB(6, 19), new ECB(2, 20)), new ECBlocks(28, new ECB(6, 15), new ECB(2, 16))), new Version(11, new Array(6, 30, 54), new ECBlocks(20, new ECB(4, 81)), new ECBlocks(30, new ECB(1, 50), new ECB(4, 51)), new ECBlocks(28, new ECB(4, 22), new ECB(4, 23)), new ECBlocks(24, new ECB(3, 12), new ECB(8, 13))), new Version(12, new Array(6, 32, 58), new ECBlocks(24, new ECB(2, 92), new ECB(2, 93)), new ECBlocks(22, new ECB(6, 36), new ECB(2, 37)), new ECBlocks(26, new ECB(4, 20), new ECB(6, 21)), new ECBlocks(28, new ECB(7, 14), new ECB(4, 15))), new Version(13, new Array(6, 34, 62), new ECBlocks(26, new ECB(4, 107)), new ECBlocks(22, new ECB(8, 37), new ECB(1, 38)), new ECBlocks(24, new ECB(8, 20), new ECB(4, 21)), new ECBlocks(22, new ECB(12, 11), new ECB(4, 12))), new Version(14, new Array(6, 26, 46, 66), new ECBlocks(30, new ECB(3, 115), new ECB(1, 116)), new ECBlocks(24, new ECB(4, 40), new ECB(5, 41)), new ECBlocks(20, new ECB(11, 16), new ECB(5, 17)), new ECBlocks(24, new ECB(11, 12), new ECB(5, 13))), new Version(15, new Array(6, 26, 48, 70), new ECBlocks(22, new ECB(5, 87), new ECB(1, 88)), new ECBlocks(24, new ECB(5, 41), new ECB(5, 42)), new ECBlocks(30, new ECB(5, 24), new ECB(7, 25)), new ECBlocks(24, new ECB(11, 12), new ECB(7, 13))), new Version(16, new Array(6, 26, 50, 74), new ECBlocks(24, new ECB(5, 98), new ECB(1, 99)), new ECBlocks(28, new ECB(7, 45), new ECB(3, 46)), new ECBlocks(24, new ECB(15, 19), new ECB(2, 20)), new ECBlocks(30, new ECB(3, 15), new ECB(13, 16))), new Version(17, new Array(6, 30, 54, 78), new ECBlocks(28, new ECB(1, 107), new ECB(5, 108)), new ECBlocks(28, new ECB(10, 46), new ECB(1, 47)), new ECBlocks(28, new ECB(1, 22), new ECB(15, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(17, 15))), new Version(18, new Array(6, 30, 56, 82), new ECBlocks(30, new ECB(5, 120), new ECB(1, 121)), new ECBlocks(26, new ECB(9, 43), new ECB(4, 44)), new ECBlocks(28, new ECB(17, 22), new ECB(1, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(19, 15))), new Version(19, new Array(6, 30, 58, 86), new ECBlocks(28, new ECB(3, 113), new ECB(4, 114)), new ECBlocks(26, new ECB(3, 44), new ECB(11, 45)), new ECBlocks(26, new ECB(17, 21), new ECB(4, 22)), new ECBlocks(26, new ECB(9, 13), new ECB(16, 14))), new Version(20, new Array(6, 34, 62, 90), new ECBlocks(28, new ECB(3, 107), new ECB(5, 108)), new ECBlocks(26, new ECB(3, 41), new ECB(13, 42)), new ECBlocks(30, new ECB(15, 24), new ECB(5, 25)), new ECBlocks(28, new ECB(15, 15), new ECB(10, 16))), new Version(21, new Array(6, 28, 50, 72, 94), new ECBlocks(28, new ECB(4, 116), new ECB(4, 117)), new ECBlocks(26, new ECB(17, 42)), new ECBlocks(28, new ECB(17, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(19, 16), new ECB(6, 17))), new Version(22, new Array(6, 26, 50, 74, 98), new ECBlocks(28, new ECB(2, 111), new ECB(7, 112)), new ECBlocks(28, new ECB(17, 46)), new ECBlocks(30, new ECB(7, 24), new ECB(16, 25)), new ECBlocks(24, new ECB(34, 13))), new Version(23, new Array(6, 30, 54, 74, 102), new ECBlocks(30, new ECB(4, 121), new ECB(5, 122)), new ECBlocks(28, new ECB(4, 47), new ECB(14, 48)), new ECBlocks(30, new ECB(11, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(16, 15), new ECB(14, 16))), new Version(24, new Array(6, 28, 54, 80, 106), new ECBlocks(30, new ECB(6, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(6, 45), new ECB(14, 46)), new ECBlocks(30, new ECB(11, 24), new ECB(16, 25)), new ECBlocks(30, new ECB(30, 16), new ECB(2, 17))), new Version(25, new Array(6, 32, 58, 84, 110), new ECBlocks(26, new ECB(8, 106), new ECB(4, 107)), new ECBlocks(28, new ECB(8, 47), new ECB(13, 48)), new ECBlocks(30, new ECB(7, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(22, 15), new ECB(13, 16))), new Version(26, new Array(6, 30, 58, 86, 114), new ECBlocks(28, new ECB(10, 114), new ECB(2, 115)), new ECBlocks(28, new ECB(19, 46), new ECB(4, 47)), new ECBlocks(28, new ECB(28, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(33, 16), new ECB(4, 17))), new Version(27, new Array(6, 34, 62, 90, 118), new ECBlocks(30, new ECB(8, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(22, 45), new ECB(3, 46)), new ECBlocks(30, new ECB(8, 23), new ECB(26, 24)), new ECBlocks(30, new ECB(12, 15), new ECB(28, 16))), new Version(28, new Array(6, 26, 50, 74, 98, 122), new ECBlocks(30, new ECB(3, 117), new ECB(10, 118)), new ECBlocks(28, new ECB(3, 45), new ECB(23, 46)), new ECBlocks(30, new ECB(4, 24), new ECB(31, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(31, 16))), new Version(29, new Array(6, 30, 54, 78, 102, 126), new ECBlocks(30, new ECB(7, 116), new ECB(7, 117)), new ECBlocks(28, new ECB(21, 45), new ECB(7, 46)), new ECBlocks(30, new ECB(1, 23), new ECB(37, 24)), new ECBlocks(30, new ECB(19, 15), new ECB(26, 16))), new Version(30, new Array(6, 26, 52, 78, 104, 130), new ECBlocks(30, new ECB(5, 115), new ECB(10, 116)), new ECBlocks(28, new ECB(19, 47), new ECB(10, 48)), new ECBlocks(30, new ECB(15, 24), new ECB(25, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(25, 16))), new Version(31, new Array(6, 30, 56, 82, 108, 134), new ECBlocks(30, new ECB(13, 115), new ECB(3, 116)), new ECBlocks(28, new ECB(2, 46), new ECB(29, 47)), new ECBlocks(30, new ECB(42, 24), new ECB(1, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(28, 16))), new Version(32, new Array(6, 34, 60, 86, 112, 138), new ECBlocks(30, new ECB(17, 115)), new ECBlocks(28, new ECB(10, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(10, 24), new ECB(35, 25)), new ECBlocks(30, new ECB(19, 15), new ECB(35, 16))), new Version(33, new Array(6, 30, 58, 86, 114, 142), new ECBlocks(30, new ECB(17, 115), new ECB(1, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(21, 47)), new ECBlocks(30, new ECB(29, 24), new ECB(19, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(46, 16))), new Version(34, new Array(6, 34, 62, 90, 118, 146), new ECBlocks(30, new ECB(13, 115), new ECB(6, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(44, 24), new ECB(7, 25)), new ECBlocks(30, new ECB(59, 16), new ECB(1, 17))), new Version(35, new Array(6, 30, 54, 78, 102, 126, 150), new ECBlocks(30, new ECB(12, 121), new ECB(7, 122)), new ECBlocks(28, new ECB(12, 47), new ECB(26, 48)), new ECBlocks(30, new ECB(39, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(22, 15), new ECB(41, 16))), new Version(36, new Array(6, 24, 50, 76, 102, 128, 154), new ECBlocks(30, new ECB(6, 121), new ECB(14, 122)), new ECBlocks(28, new ECB(6, 47), new ECB(34, 48)), new ECBlocks(30, new ECB(46, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(2, 15), new ECB(64, 16))), new Version(37, new Array(6, 28, 54, 80, 106, 132, 158), new ECBlocks(30, new ECB(17, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(29, 46), new ECB(14, 47)), new ECBlocks(30, new ECB(49, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(24, 15), new ECB(46, 16))), new Version(38, new Array(6, 32, 58, 84, 110, 136, 162), new ECBlocks(30, new ECB(4, 122), new ECB(18, 123)), new ECBlocks(28, new ECB(13, 46), new ECB(32, 47)), new ECBlocks(30, new ECB(48, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(42, 15), new ECB(32, 16))), new Version(39, new Array(6, 26, 54, 82, 110, 138, 166), new ECBlocks(30, new ECB(20, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(40, 47), new ECB(7, 48)), new ECBlocks(30, new ECB(43, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(10, 15), new ECB(67, 16))), new Version(40, new Array(6, 30, 58, 86, 114, 142, 170), new ECBlocks(30, new ECB(19, 118), new ECB(6, 119)), new ECBlocks(28, new ECB(18, 47), new ECB(31, 48)), new ECBlocks(30, new ECB(34, 24), new ECB(34, 25)), new ECBlocks(30, new ECB(20, 15), new ECB(61, 16))))
}
function PerspectiveTransform(e, r, t, n, i, a, o, s, h) {
    this.a11 = e;
    this.a12 = n;
    this.a13 = o;
    this.a21 = r;
    this.a22 = i;
    this.a23 = s;
    this.a31 = t;
    this.a32 = a;
    this.a33 = h;
    this.transformPoints1 = function(e) {
        var r = e.length;
        var t = this.a11;
        var n = this.a12;
        var i = this.a13;
        var a = this.a21;
        var o = this.a22;
        var s = this.a23;
        var h = this.a31;
        var l = this.a32;
        var c = this.a33;
        for (var f = 0; f < r; f += 2) {
            var w = e[f];
            var d = e[f + 1];
            var u = i * w + s * d + c;
            e[f] = (t * w + a * d + h) / u;
            e[f + 1] = (n * w + o * d + l) / u
        }
    };
    this.transformPoints2 = function(e, r) {
        var t = e.length;
        for (var n = 0; n < t; n++) {
            var i = e[n];
            var a = r[n];
            var o = this.a13 * i + this.a23 * a + this.a33;
            e[n] = (this.a11 * i + this.a21 * a + this.a31) / o;
            r[n] = (this.a12 * i + this.a22 * a + this.a32) / o
        }
    };
    this.buildAdjoint = function() {
        return new PerspectiveTransform(this.a22 * this.a33 - this.a23 * this.a32, this.a23 * this.a31 - this.a21 * this.a33, this.a21 * this.a32 - this.a22 * this.a31, this.a13 * this.a32 - this.a12 * this.a33, this.a11 * this.a33 - this.a13 * this.a31, this.a12 * this.a31 - this.a11 * this.a32, this.a12 * this.a23 - this.a13 * this.a22, this.a13 * this.a21 - this.a11 * this.a23, this.a11 * this.a22 - this.a12 * this.a21)
    };
    this.times = function(e) {
        return new PerspectiveTransform(this.a11 * e.a11 + this.a21 * e.a12 + this.a31 * e.a13, this.a11 * e.a21 + this.a21 * e.a22 + this.a31 * e.a23, this.a11 * e.a31 + this.a21 * e.a32 + this.a31 * e.a33, this.a12 * e.a11 + this.a22 * e.a12 + this.a32 * e.a13, this.a12 * e.a21 + this.a22 * e.a22 + this.a32 * e.a23, this.a12 * e.a31 + this.a22 * e.a32 + this.a32 * e.a33, this.a13 * e.a11 + this.a23 * e.a12 + this.a33 * e.a13, this.a13 * e.a21 + this.a23 * e.a22 + this.a33 * e.a23, this.a13 * e.a31 + this.a23 * e.a32 + this.a33 * e.a33)
    }
}
PerspectiveTransform.quadrilateralToQuadrilateral = function(e, r, t, n, i, a, o, s, h, l, c, f, w, d, u, C) {
    var E = this.quadrilateralToSquare(e, r, t, n, i, a, o, s);
    var v = this.squareToQuadrilateral(h, l, c, f, w, d, u, C);
    return v.times(E)
};
PerspectiveTransform.squareToQuadrilateral = function(e, r, t, n, i, a, o, s) {
    dy2 = s - a;
    dy3 = r - n + a - s;
    if (dy2 == 0 && dy3 == 0) {
        return new PerspectiveTransform(t - e, i - t, e, n - r, a - n, r, 0, 0, 1)
    } else {
        dx1 = t - i;
        dx2 = o - i;
        dx3 = e - t + i - o;
        dy1 = n - a;
        denominator = dx1 * dy2 - dx2 * dy1;
        a13 = (dx3 * dy2 - dx2 * dy3) / denominator;
        a23 = (dx1 * dy3 - dx3 * dy1) / denominator;
        return new PerspectiveTransform(t - e + a13 * t, o - e + a23 * o, e, n - r + a13 * n, s - r + a23 * s, r, a13, a23, 1)
    }
};
PerspectiveTransform.quadrilateralToSquare = function(e, r, t, n, i, a, o, s) {
    return this.squareToQuadrilateral(e, r, t, n, i, a, o, s).buildAdjoint()
};
function DetectorResult(e, r) {
    this.bits = e;
    this.points = r
}
function Detector(e) {
    this.image = e;
    this.resultPointCallback = null;
    this.sizeOfBlackWhiteBlackRun = function(e, r, t, n) {
        var i = Math.abs(n - r) > Math.abs(t - e);
        if (i) {
            var a = e;
            e = r;
            r = a;
            a = t;
            t = n;
            n = a
        }
        var o = Math.abs(t - e);
        var s = Math.abs(n - r);
        var h =- o>>1;
        var l = r < n ? 1: - 1;
        var c = e < t ? 1: - 1;
        var f = 0;
        for (var w = e, d = r; w != t; w += c) {
            var u = i ? d: w;
            var C = i ? w: d;
            if (f == 1) {
                if (this.image[u + C * qrcode.width]) {
                    f++
                }
            } else {
                if (!this.image[u + C * qrcode.width]) {
                    f++
                }
            }
            if (f == 3) {
                var E = w - e;
                var v = d - r;
                return Math.sqrt(E * E + v * v)
            }
            h += s;
            if (h > 0) {
                if (d == n) {
                    break
                }
                d += l;
                h -= o
            }
        }
        var B = t - e;
        var g = n - r;
        return Math.sqrt(B * B + g * g)
    };
    this.sizeOfBlackWhiteBlackRunBothWays = function(e, r, t, n) {
        var i = this.sizeOfBlackWhiteBlackRun(e, r, t, n);
        var a = 1;
        var o = e - (t - e);
        if (o < 0) {
            a = e / (e - o);
            o = 0
        } else if (o >= qrcode.width) {
            a = (qrcode.width - 1 - e) / (o - e);
            o = qrcode.width - 1
        }
        var s = Math.floor(r - (n - r) * a);
        a = 1;
        if (s < 0) {
            a = r / (r - s);
            s = 0
        } else if (s >= qrcode.height) {
            a = (qrcode.height - 1 - r) / (s - r);
            s = qrcode.height - 1
        }
        o = Math.floor(e + (o - e) * a);
        i += this.sizeOfBlackWhiteBlackRun(e, r, o, s);
        return i - 1
    };
    this.calculateModuleSizeOneWay = function(e, r) {
        var t = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(e.X), Math.floor(e.Y), Math.floor(r.X), Math.floor(r.Y));
        var n = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(r.X), Math.floor(r.Y), Math.floor(e.X), Math.floor(e.Y));
        if (isNaN(t)) {
            return n / 7
        }
        if (isNaN(n)) {
            return t / 7
        }
        return (t + n) / 14
    };
    this.calculateModuleSize = function(e, r, t) {
        return (this.calculateModuleSizeOneWay(e, r) + this.calculateModuleSizeOneWay(e, t)) / 2
    };
    this.distance = function(e, r) {
        xDiff = e.X - r.X;
        yDiff = e.Y - r.Y;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
    };
    this.computeDimension = function(e, r, t, n) {
        var i = Math.round(this.distance(e, r) / n);
        var a = Math.round(this.distance(e, t) / n);
        var o = (i + a>>1) + 7;
        switch (o & 3) {
        case 0:
            o++;
            break;
        case 2:
            o--;
            break;
        case 3:
            throw "Error"
        }
        return o
    };
    this.findAlignmentInRegion = function(e, r, t, n) {
        var i = Math.floor(n * e);
        var a = Math.max(0, r - i);
        var o = Math.min(qrcode.width - 1, r + i);
        if (o - a < e * 3) {
            throw "Error"
        }
        var s = Math.max(0, t - i);
        var h = Math.min(qrcode.height - 1, t + i);
        var l = new AlignmentPatternFinder(this.image, a, s, o - a, h - s, e, this.resultPointCallback);
        return l.find()
    };
    this.createTransform = function(e, r, t, n, i) {
        var a = i - 3.5;
        var o;
        var s;
        var h;
        var l;
        if (n != null) {
            o = n.X;
            s = n.Y;
            h = l = a - 3
        } else {
            o = r.X - e.X + t.X;
            s = r.Y - e.Y + t.Y;
            h = l = a
        }
        var c = PerspectiveTransform.quadrilateralToQuadrilateral(3.5, 3.5, a, 3.5, h, l, 3.5, a, e.X, e.Y, r.X, r.Y, o, s, t.X, t.Y);
        return c
    };
    this.sampleGrid = function(e, r, t) {
        var n = GridSampler;
        return n.sampleGrid3(e, t, r)
    };
    this.processFinderPatternInfo = function(e) {
        var r = e.TopLeft;
        var t = e.TopRight;
        var n = e.BottomLeft;
        var i = this.calculateModuleSize(r, t, n);
        if (i < 1) {
            throw "Error"
        }
        var a = this.computeDimension(r, t, n, i);
        var o = Version.getProvisionalVersionForDimension(a);
        var s = o.DimensionForVersion - 7;
        var h = null;
        if (o.AlignmentPatternCenters.length > 0) {
            var l = t.X - r.X + n.X;
            var c = t.Y - r.Y + n.Y;
            var f = 1 - 3 / s;
            var w = Math.floor(r.X + f * (l - r.X));
            var d = Math.floor(r.Y + f * (c - r.Y));
            for (var u = 4; u <= 16; u<<=1) {
                h = this.findAlignmentInRegion(i, w, d, u);
                break
            }
        }
        var C = this.createTransform(r, t, n, h, a);
        var E = this.sampleGrid(this.image, C, a);
        var v;
        if (h == null) {
            v = new Array(n, r, t)
        } else {
            v = new Array(n, r, t, h)
        }
        return new DetectorResult(E, v)
    };
    this.detect = function() {
        var e = (new FinderPatternFinder).findFinderPattern(this.image);
        return this.processFinderPatternInfo(e)
    }
}
var FORMAT_INFO_MASK_QR = 21522;
var FORMAT_INFO_DECODE_LOOKUP = new Array(new Array(21522, 0), new Array(20773, 1), new Array(24188, 2), new Array(23371, 3), new Array(17913, 4), new Array(16590, 5), new Array(20375, 6), new Array(19104, 7), new Array(30660, 8), new Array(29427, 9), new Array(32170, 10), new Array(30877, 11), new Array(26159, 12), new Array(25368, 13), new Array(27713, 14), new Array(26998, 15), new Array(5769, 16), new Array(5054, 17), new Array(7399, 18), new Array(6608, 19), new Array(1890, 20), new Array(597, 21), new Array(3340, 22), new Array(2107, 23), new Array(13663, 24), new Array(12392, 25), new Array(16177, 26), new Array(14854, 27), new Array(9396, 28), new Array(8579, 29), new Array(11994, 30), new Array(11245, 31));
var BITS_SET_IN_HALF_BYTE = new Array(0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4);
function FormatInformation(e) {
    this.errorCorrectionLevel = ErrorCorrectionLevel.forBits(e>>3 & 3);
    this.dataMask = e & 7;
    this.__defineGetter__("ErrorCorrectionLevel", function() {
        return this.errorCorrectionLevel
    });
    this.__defineGetter__("DataMask", function() {
        return this.dataMask
    });
    this.GetHashCode = function() {
        return this.errorCorrectionLevel.ordinal()<<3 | dataMask
    };
    this.Equals = function(e) {
        var r = e;
        return this.errorCorrectionLevel == r.errorCorrectionLevel && this.dataMask == r.dataMask
    }
}
FormatInformation.numBitsDiffering = function(e, r) {
    e^=r;
    return BITS_SET_IN_HALF_BYTE[e & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 4) & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 8) & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 12) & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 16) & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 20) & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 24) & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 28) & 15]
};
FormatInformation.decodeFormatInformation = function(e) {
    var r = FormatInformation.doDecodeFormatInformation(e);
    if (r != null) {
        return r
    }
    return FormatInformation.doDecodeFormatInformation(e^FORMAT_INFO_MASK_QR)
};
FormatInformation.doDecodeFormatInformation = function(e) {
    var r = 4294967295;
    var t = 0;
    for (var n = 0; n < FORMAT_INFO_DECODE_LOOKUP.length; n++) {
        var i = FORMAT_INFO_DECODE_LOOKUP[n];
        var a = i[0];
        if (a == e) {
            return new FormatInformation(i[1])
        }
        var o = this.numBitsDiffering(e, a);
        if (o < r) {
            t = i[1];
            r = o
        }
    }
    if (r <= 3) {
        return new FormatInformation(t)
    }
    return null
};
function ErrorCorrectionLevel(e, r, t) {
    this.ordinal_Renamed_Field = e;
    this.bits = r;
    this.name = t;
    this.__defineGetter__("Bits", function() {
        return this.bits
    });
    this.__defineGetter__("Name", function() {
        return this.name
    });
    this.ordinal = function() {
        return this.ordinal_Renamed_Field
    }
}
ErrorCorrectionLevel.forBits = function(e) {
    if (e < 0 || e >= FOR_BITS.length) {
        throw "ArgumentException"
    }
    return FOR_BITS[e]
};
var L = new ErrorCorrectionLevel(0, 1, "L");
var M = new ErrorCorrectionLevel(1, 0, "M");
var Q = new ErrorCorrectionLevel(2, 3, "Q");
var H = new ErrorCorrectionLevel(3, 2, "H");
var FOR_BITS = new Array(M, L, H, Q);
function BitMatrix(e, r) {
    if (!r)
        r = e;
    if (e < 1 || r < 1) {
        throw "Both dimensions must be greater than 0"
    }
    this.width = e;
    this.height = r;
    var t = e>>5;
    if ((e & 31) != 0) {
        t++
    }
    this.rowSize = t;
    this.bits = new Array(t * r);
    for (var n = 0; n < this.bits.length; n++)
        this.bits[n] = 0;
    this.__defineGetter__("Width", function() {
        return this.width
    });
    this.__defineGetter__("Height", function() {
        return this.height
    });
    this.__defineGetter__("Dimension", function() {
        if (this.width != this.height) {
            throw "Can't call getDimension() on a non-square matrix"
        }
        return this.width
    });
    this.get_Renamed = function(e, r) {
        var t = r * this.rowSize + (e>>5);
        return (URShift(this.bits[t], e & 31) & 1) != 0
    };
    this.set_Renamed = function(e, r) {
        var t = r * this.rowSize + (e>>5);
        this.bits[t]|=1<<(e & 31)
    };
    this.flip = function(e, r) {
        var t = r * this.rowSize + (e>>5);
        this.bits[t]^=1<<(e & 31)
    };
    this.clear = function() {
        var e = this.bits.length;
        for (var r = 0; r < e; r++) {
            this.bits[r] = 0
        }
    };
    this.setRegion = function(e, r, t, n) {
        if (r < 0 || e < 0) {
            throw "Left and top must be nonnegative"
        }
        if (n < 1 || t < 1) {
            throw "Height and width must be at least 1"
        }
        var i = e + t;
        var a = r + n;
        if (a > this.height || i > this.width) {
            throw "The region must fit inside the matrix"
        }
        for (var o = r; o < a; o++) {
            var s = o * this.rowSize;
            for (var h = e; h < i; h++) {
                this.bits[s + (h>>5)]|=1<<(h & 31)
            }
        }
    }
}
function DataBlock(e, r) {
    this.numDataCodewords = e;
    this.codewords = r;
    this.__defineGetter__("NumDataCodewords", function() {
        return this.numDataCodewords
    });
    this.__defineGetter__("Codewords", function() {
        return this.codewords
    })
}
DataBlock.getDataBlocks = function(e, r, t) {
    if (e.length != r.TotalCodewords) {
        throw "ArgumentException"
    }
    var n = r.getECBlocksForLevel(t);
    var i = 0;
    var a = n.getECBlocks();
    for (var o = 0; o < a.length; o++) {
        i += a[o].Count
    }
    var s = new Array(i);
    var h = 0;
    for (var l = 0; l < a.length; l++) {
        var c = a[l];
        for (var o = 0; o < c.Count; o++) {
            var f = c.DataCodewords;
            var w = n.ECCodewordsPerBlock + f;
            s[h++] = new DataBlock(f, new Array(w))
        }
    }
    var d = s[0].codewords.length;
    var u = s.length - 1;
    while (u >= 0) {
        var C = s[u].codewords.length;
        if (C == d) {
            break
        }
        u--
    }
    u++;
    var E = d - n.ECCodewordsPerBlock;
    var v = 0;
    for (var o = 0; o < E; o++) {
        for (var l = 0; l < h; l++) {
            s[l].codewords[o] = e[v++]
        }
    }
    for (var l = u; l < h; l++) {
        s[l].codewords[E] = e[v++]
    }
    var B = s[0].codewords.length;
    for (var o = E; o < B; o++) {
        for (var l = 0; l < h; l++) {
            var g = l < u ? o: o + 1;
            s[l].codewords[g] = e[v++]
        }
    }
    return s
};
function BitMatrixParser(e) {
    var r = e.Dimension;
    if (r < 21 || (r & 3) != 1) {
        throw "Error BitMatrixParser"
    }
    this.bitMatrix = e;
    this.parsedVersion = null;
    this.parsedFormatInfo = null;
    this.copyBit = function(e, r, t) {
        return this.bitMatrix.get_Renamed(e, r) ? t<<1 | 1 : t<<1
    };
    this.readFormatInformation = function() {
        if (this.parsedFormatInfo != null) {
            return this.parsedFormatInfo
        }
        var e = 0;
        for (var r = 0; r < 6; r++) {
            e = this.copyBit(r, 8, e)
        }
        e = this.copyBit(7, 8, e);
        e = this.copyBit(8, 8, e);
        e = this.copyBit(8, 7, e);
        for (var t = 5; t >= 0; t--) {
            e = this.copyBit(8, t, e)
        }
        this.parsedFormatInfo = FormatInformation.decodeFormatInformation(e);
        if (this.parsedFormatInfo != null) {
            return this.parsedFormatInfo
        }
        var n = this.bitMatrix.Dimension;
        e = 0;
        var i = n - 8;
        for (var r = n - 1; r >= i; r--) {
            e = this.copyBit(r, 8, e)
        }
        for (var t = n - 7; t < n; t++) {
            e = this.copyBit(8, t, e)
        }
        this.parsedFormatInfo = FormatInformation.decodeFormatInformation(e);
        if (this.parsedFormatInfo != null) {
            return this.parsedFormatInfo
        }
        throw "Error readFormatInformation"
    };
    this.readVersion = function() {
        if (this.parsedVersion != null) {
            return this.parsedVersion
        }
        var e = this.bitMatrix.Dimension;
        var r = e - 17>>2;
        if (r <= 6) {
            return Version.getVersionForNumber(r)
        }
        var t = 0;
        var n = e - 11;
        for (var i = 5; i >= 0; i--) {
            for (var a = e - 9; a >= n; a--) {
                t = this.copyBit(a, i, t)
            }
        }
        this.parsedVersion = Version.decodeVersionInformation(t);
        if (this.parsedVersion != null && this.parsedVersion.DimensionForVersion == e) {
            return this.parsedVersion
        }
        t = 0;
        for (var a = 5; a >= 0; a--) {
            for (var i = e - 9; i >= n; i--) {
                t = this.copyBit(a, i, t)
            }
        }
        this.parsedVersion = Version.decodeVersionInformation(t);
        if (this.parsedVersion != null && this.parsedVersion.DimensionForVersion == e) {
            return this.parsedVersion
        }
        throw "Error readVersion"
    };
    this.readCodewords = function() {
        var e = this.readFormatInformation();
        var r = this.readVersion();
        var t = DataMask.forReference(e.DataMask);
        var n = this.bitMatrix.Dimension;
        t.unmaskBitMatrix(this.bitMatrix, n);
        var i = r.buildFunctionPattern();
        var a = true;
        var o = new Array(r.TotalCodewords);
        var s = 0;
        var h = 0;
        var l = 0;
        for (var c = n - 1; c > 0; c -= 2) {
            if (c == 6) {
                c--
            }
            for (var f = 0; f < n; f++) {
                var w = a ? n - 1 - f: f;
                for (var d = 0; d < 2; d++) {
                    if (!i.get_Renamed(c - d, w)) {
                        l++;
                        h<<=1;
                        if (this.bitMatrix.get_Renamed(c - d, w)) {
                            h|=1
                        }
                        if (l == 8) {
                            o[s++] = h;
                            l = 0;
                            h = 0
                        }
                    }
                }
            }
            a^=true
        }
        if (s != r.TotalCodewords) {
            throw "Error readCodewords"
        }
        return o
    }
}
DataMask = {};
DataMask.forReference = function(e) {
    if (e < 0 || e > 7) {
        throw "System.ArgumentException"
    }
    return DataMask.DATA_MASKS[e]
};
function DataMask000() {
    this.unmaskBitMatrix = function(e, r) {
        for (var t = 0; t < r; t++) {
            for (var n = 0; n < r; n++) {
                if (this.isMasked(t, n)) {
                    e.flip(n, t)
                }
            }
        }
    };
    this.isMasked = function(e, r) {
        return (e + r & 1) == 0
    }
}
function DataMask001() {
    this.unmaskBitMatrix = function(e, r) {
        for (var t = 0; t < r; t++) {
            for (var n = 0; n < r; n++) {
                if (this.isMasked(t, n)) {
                    e.flip(n, t)
                }
            }
        }
    };
    this.isMasked = function(e, r) {
        return (e & 1) == 0
    }
}
function DataMask010() {
    this.unmaskBitMatrix = function(e, r) {
        for (var t = 0; t < r; t++) {
            for (var n = 0; n < r; n++) {
                if (this.isMasked(t, n)) {
                    e.flip(n, t)
                }
            }
        }
    };
    this.isMasked = function(e, r) {
        return r%3 == 0
    }
}
function DataMask011() {
    this.unmaskBitMatrix = function(e, r) {
        for (var t = 0; t < r; t++) {
            for (var n = 0; n < r; n++) {
                if (this.isMasked(t, n)) {
                    e.flip(n, t)
                }
            }
        }
    };
    this.isMasked = function(e, r) {
        return (e + r)%3 == 0
    }
}
function DataMask100() {
    this.unmaskBitMatrix = function(e, r) {
        for (var t = 0; t < r; t++) {
            for (var n = 0; n < r; n++) {
                if (this.isMasked(t, n)) {
                    e.flip(n, t)
                }
            }
        }
    };
    this.isMasked = function(e, r) {
        return (URShift(e, 1) + r / 3 & 1) == 0
    }
}
function DataMask101() {
    this.unmaskBitMatrix = function(e, r) {
        for (var t = 0; t < r; t++) {
            for (var n = 0; n < r; n++) {
                if (this.isMasked(t, n)) {
                    e.flip(n, t)
                }
            }
        }
    };
    this.isMasked = function(e, r) {
        var t = e * r;
        return (t & 1) + t%3 == 0
    }
}
function DataMask110() {
    this.unmaskBitMatrix = function(e, r) {
        for (var t = 0; t < r; t++) {
            for (var n = 0; n < r; n++) {
                if (this.isMasked(t, n)) {
                    e.flip(n, t)
                }
            }
        }
    };
    this.isMasked = function(e, r) {
        var t = e * r;
        return ((t & 1) + t%3 & 1) == 0
    }
}
function DataMask111() {
    this.unmaskBitMatrix = function(e, r) {
        for (var t = 0; t < r; t++) {
            for (var n = 0; n < r; n++) {
                if (this.isMasked(t, n)) {
                    e.flip(n, t)
                }
            }
        }
    };
    this.isMasked = function(e, r) {
        return ((e + r & 1) + e * r%3 & 1) == 0
    }
}
DataMask.DATA_MASKS = new Array(new DataMask000, new DataMask001, new DataMask010, new DataMask011, new DataMask100, new DataMask101, new DataMask110, new DataMask111);
function ReedSolomonDecoder(e) {
    this.field = e;
    this.decode = function(e, r) {
        var t = new GF256Poly(this.field, e);
        var n = new Array(r);
        for (var i = 0; i < n.length; i++)
            n[i] = 0;
        var a = false;
        var o = true;
        for (var i = 0; i < r; i++) {
            var s = t.evaluateAt(this.field.exp(a ? i + 1 : i));
            n[n.length - 1 - i] = s;
            if (s != 0) {
                o = false
            }
        }
        if (o) {
            return 
        }
        var h = new GF256Poly(this.field, n);
        var l = this.runEuclideanAlgorithm(this.field.buildMonomial(r, 1), h, r);
        var c = l[0];
        var f = l[1];
        var w = this.findErrorLocations(c);
        var d = this.findErrorMagnitudes(f, w, a);
        for (var i = 0; i < w.length; i++) {
            var u = e.length - 1 - this.field.log(w[i]);
            if (u < 0) {
                throw "ReedSolomonException Bad error location"
            }
            e[u] = GF256.addOrSubtract(e[u], d[i])
        }
    };
    this.runEuclideanAlgorithm = function(e, r, t) {
        if (e.Degree < r.Degree) {
            var n = e;
            e = r;
            r = n
        }
        var i = e;
        var a = r;
        var o = this.field.One;
        var s = this.field.Zero;
        var h = this.field.Zero;
        var l = this.field.One;
        while (a.Degree >= Math.floor(t / 2)) {
            var c = i;
            var f = o;
            var w = h;
            i = a;
            o = s;
            h = l;
            if (i.Zero) {
                throw "r_{i-1} was zero"
            }
            a = c;
            var d = this.field.Zero;
            var u = i.getCoefficient(i.Degree);
            var C = this.field.inverse(u);
            while (a.Degree >= i.Degree&&!a.Zero) {
                var E = a.Degree - i.Degree;
                var v = this.field.multiply(a.getCoefficient(a.Degree), C);
                d = d.addOrSubtract(this.field.buildMonomial(E, v));
                a = a.addOrSubtract(i.multiplyByMonomial(E, v))
            }
            s = d.multiply1(o).addOrSubtract(f);
            l = d.multiply1(h).addOrSubtract(w)
        }
        var B = l.getCoefficient(0);
        if (B == 0) {
            throw "ReedSolomonException sigmaTilde(0) was zero"
        }
        var g = this.field.inverse(B);
        var k = l.multiply2(g);
        var m = a.multiply2(g);
        return new Array(k, m)
    };
    this.findErrorLocations = function(e) {
        var r = e.Degree;
        if (r == 1) {
            return new Array(e.getCoefficient(1))
        }
        var t = new Array(r);
        var n = 0;
        for (var i = 1; i < 256 && n < r; i++) {
            if (e.evaluateAt(i) == 0) {
                t[n] = this.field.inverse(i);
                n++
            }
        }
        if (n != r) {
            throw "Error locator degree does not match number of roots"
        }
        return t
    };
    this.findErrorMagnitudes = function(e, r, t) {
        var n = r.length;
        var i = new Array(n);
        for (var a = 0; a < n; a++) {
            var o = this.field.inverse(r[a]);
            var s = 1;
            for (var h = 0; h < n; h++) {
                if (a != h) {
                    s = this.field.multiply(s, GF256.addOrSubtract(1, this.field.multiply(r[h], o)))
                }
            }
            i[a] = this.field.multiply(e.evaluateAt(o), this.field.inverse(s));
            if (t) {
                i[a] = this.field.multiply(i[a], o)
            }
        }
        return i
    }
}
function GF256Poly(e, r) {
    if (r == null || r.length == 0) {
        throw "System.ArgumentException"
    }
    this.field = e;
    var t = r.length;
    if (t > 1 && r[0] == 0) {
        var n = 1;
        while (n < t && r[n] == 0) {
            n++
        }
        if (n == t) {
            this.coefficients = e.Zero.coefficients
        } else {
            this.coefficients = new Array(t - n);
            for (var i = 0; i < this.coefficients.length; i++)
                this.coefficients[i] = 0;
            for (var a = 0; a < this.coefficients.length; a++)
                this.coefficients[a] = r[n + a]
        }
    } else {
        this.coefficients = r
    }
    this.__defineGetter__("Zero", function() {
        return this.coefficients[0] == 0
    });
    this.__defineGetter__("Degree", function() {
        return this.coefficients.length - 1
    });
    this.__defineGetter__("Coefficients", function() {
        return this.coefficients
    });
    this.getCoefficient = function(e) {
        return this.coefficients[this.coefficients.length - 1 - e]
    };
    this.evaluateAt = function(e) {
        if (e == 0) {
            return this.getCoefficient(0)
        }
        var r = this.coefficients.length;
        if (e == 1) {
            var t = 0;
            for (var n = 0; n < r; n++) {
                t = GF256.addOrSubtract(t, this.coefficients[n])
            }
            return t
        }
        var i = this.coefficients[0];
        for (var n = 1; n < r; n++) {
            i = GF256.addOrSubtract(this.field.multiply(e, i), this.coefficients[n])
        }
        return i
    };
    this.addOrSubtract = function(r) {
        if (this.field != r.field) {
            throw "GF256Polys do not have same GF256 field"
        }
        if (this.Zero) {
            return r
        }
        if (r.Zero) {
            return this
        }
        var t = this.coefficients;
        var n = r.coefficients;
        if (t.length > n.length) {
            var i = t;
            t = n;
            n = i
        }
        var a = new Array(n.length);
        var o = n.length - t.length;
        for (var s = 0; s < o; s++)
            a[s] = n[s];
        for (var h = o; h < n.length; h++) {
            a[h] = GF256.addOrSubtract(t[h - o], n[h])
        }
        return new GF256Poly(e, a)
    };
    this.multiply1 = function(e) {
        if (this.field != e.field) {
            throw "GF256Polys do not have same GF256 field"
        }
        if (this.Zero || e.Zero) {
            return this.field.Zero
        }
        var r = this.coefficients;
        var t = r.length;
        var n = e.coefficients;
        var i = n.length;
        var a = new Array(t + i - 1);
        for (var o = 0; o < t; o++) {
            var s = r[o];
            for (var h = 0; h < i; h++) {
                a[o + h] = GF256.addOrSubtract(a[o + h], this.field.multiply(s, n[h]))
            }
        }
        return new GF256Poly(this.field, a)
    };
    this.multiply2 = function(e) {
        if (e == 0) {
            return this.field.Zero
        }
        if (e == 1) {
            return this
        }
        var r = this.coefficients.length;
        var t = new Array(r);
        for (var n = 0; n < r; n++) {
            t[n] = this.field.multiply(this.coefficients[n], e)
        }
        return new GF256Poly(this.field, t)
    };
    this.multiplyByMonomial = function(e, r) {
        if (e < 0) {
            throw "System.ArgumentException"
        }
        if (r == 0) {
            return this.field.Zero
        }
        var t = this.coefficients.length;
        var n = new Array(t + e);
        for (var i = 0; i < n.length; i++)
            n[i] = 0;
        for (var i = 0; i < t; i++) {
            n[i] = this.field.multiply(this.coefficients[i], r)
        }
        return new GF256Poly(this.field, n)
    };
    this.divide = function(e) {
        if (this.field != e.field) {
            throw "GF256Polys do not have same GF256 field"
        }
        if (e.Zero) {
            throw "Divide by 0"
        }
        var r = this.field.Zero;
        var t = this;
        var n = e.getCoefficient(e.Degree);
        var i = this.field.inverse(n);
        while (t.Degree >= e.Degree&&!t.Zero) {
            var a = t.Degree - e.Degree;
            var o = this.field.multiply(t.getCoefficient(t.Degree), i);
            var s = e.multiplyByMonomial(a, o);
            var h = this.field.buildMonomial(a, o);
            r = r.addOrSubtract(h);
            t = t.addOrSubtract(s)
        }
        return new Array(r, t)
    }
}
function GF256(e) {
    this.expTable = new Array(256);
    this.logTable = new Array(256);
    var r = 1;
    for (var t = 0; t < 256; t++) {
        this.expTable[t] = r;
        r<<=1;
        if (r >= 256) {
            r^=e
        }
    }
    for (var t = 0; t < 255; t++) {
        this.logTable[this.expTable[t]] = t
    }
    var n = new Array(1);
    n[0] = 0;
    this.zero = new GF256Poly(this, new Array(n));
    var i = new Array(1);
    i[0] = 1;
    this.one = new GF256Poly(this, new Array(i));
    this.__defineGetter__("Zero", function() {
        return this.zero
    });
    this.__defineGetter__("One", function() {
        return this.one
    });
    this.buildMonomial = function(e, r) {
        if (e < 0) {
            throw "System.ArgumentException"
        }
        if (r == 0) {
            return zero
        }
        var t = new Array(e + 1);
        for (var n = 0; n < t.length; n++)
            t[n] = 0;
        t[0] = r;
        return new GF256Poly(this, t)
    };
    this.exp = function(e) {
        return this.expTable[e]
    };
    this.log = function(e) {
        if (e == 0) {
            throw "System.ArgumentException"
        }
        return this.logTable[e]
    };
    this.inverse = function(e) {
        if (e == 0) {
            throw "System.ArithmeticException"
        }
        return this.expTable[255 - this.logTable[e]]
    };
    this.multiply = function(e, r) {
        if (e == 0 || r == 0) {
            return 0
        }
        if (e == 1) {
            return r
        }
        if (r == 1) {
            return e
        }
        return this.expTable[(this.logTable[e] + this.logTable[r])%255]
    }
}
GF256.QR_CODE_FIELD = new GF256(285);
GF256.DATA_MATRIX_FIELD = new GF256(301);
GF256.addOrSubtract = function(e, r) {
    return e^r
};
Decoder = {};
Decoder.rsDecoder = new ReedSolomonDecoder(GF256.QR_CODE_FIELD);
Decoder.correctErrors = function(e, r) {
    var t = e.length;
    var n = new Array(t);
    for (var i = 0; i < t; i++) {
        n[i] = e[i] & 255
    }
    var a = e.length - r;
    try {
        Decoder.rsDecoder.decode(n, a)
    } catch (o) {
        throw o
    }
    for (var i = 0; i < r; i++) {
        e[i] = n[i]
    }
};
Decoder.decode = function(e) {
    var r = new BitMatrixParser(e);
    var t = r.readVersion();
    var n = r.readFormatInformation().ErrorCorrectionLevel;
    var i = r.readCodewords();
    var a = DataBlock.getDataBlocks(i, t, n);
    var o = 0;
    for (var s = 0; s < a.length; s++) {
        o += a[s].NumDataCodewords
    }
    var h = new Array(o);
    var l = 0;
    for (var c = 0; c < a.length; c++) {
        var f = a[c];
        var w = f.Codewords;
        var d = f.NumDataCodewords;
        Decoder.correctErrors(w, d);
        for (var s = 0; s < d; s++) {
            h[l++] = w[s]
        }
    }
    var u = new QRCodeDataBlockReader(h, t.VersionNumber, n.Bits);
    return u
};
qrcode = {};
qrcode.imagedata = null;
qrcode.width = 0;
qrcode.height = 0;
qrcode.qrCodeSymbol = null;
qrcode.debug = false;
qrcode.maxImgSize = 1024 * 1024;
qrcode.sizeOfDataLengthInfo = [[10, 9, 8, 8], [12, 11, 16, 10], [14, 13, 16, 12]];
qrcode.callback = null;
qrcode.decode = function(e) {
    if (arguments.length == 0) {
        var r = document.getElementById("qr-canvas");
        var t = r.getContext("2d");
        qrcode.width = r.width;
        qrcode.height = r.height;
        qrcode.imagedata = t.getImageData(0, 0, qrcode.width, qrcode.height);
        qrcode.result = qrcode.process(t);
        if (qrcode.callback != null)
            qrcode.callback(qrcode.result);
        return qrcode.result
    } else {
        var n = new Image;
        n.onload = function() {
            var e = document.createElement("canvas");
            var r = e.getContext("2d");
            var t = n.height;
            var i = n.width;
            if (n.width * n.height > qrcode.maxImgSize) {
                var a = n.width / n.height;
                t = Math.sqrt(qrcode.maxImgSize / a);
                i = a * t
            }
            e.width = i;
            e.height = t;
            r.drawImage(n, 0, 0, e.width, e.height);
            qrcode.width = e.width;
            qrcode.height = e.height;
            try {
                qrcode.imagedata = r.getImageData(0, 0, e.width, e.height)
            } catch (o) {
                qrcode.result = "Cross domain image reading not supported in your browser! Save it to your computer then drag and drop the file!";
                if (qrcode.callback != null)
                    qrcode.callback(qrcode.result);
                return 
            }
            try {
                qrcode.result = qrcode.process(r)
            } catch (o) {
                console.log(o);
                qrcode.result = "error decoding QR Code"
            }
            if (qrcode.callback != null)
                qrcode.callback(qrcode.result)
        };
        n.src = e
    }
};
qrcode.isUrl = function(e) {
    var r = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return r.test(e)
};
qrcode.decode_url = function(e) {
    var r = "";
    try {
        r = escape(e)
    } catch (t) {
        console.log(t);
        r = e
    }
    var n = "";
    try {
        n = decodeURIComponent(r)
    } catch (t) {
        console.log(t);
        n = r
    }
    return n
};
qrcode.decode_utf8 = function(e) {
    if (qrcode.isUrl(e))
        return qrcode.decode_url(e);
    else 
        return e
};
qrcode.process = function(e) {
    var r = (new Date).getTime();
    var t = qrcode.grayScaleToBitmap(qrcode.grayscale());
    if (qrcode.debug) {
        for (var n = 0; n < qrcode.height; n++) {
            for (var i = 0; i < qrcode.width; i++) {
                var a = i * 4 + n * qrcode.width * 4;
                qrcode.imagedata.data[a] = t[i + n * qrcode.width] ? 0 : 0;
                qrcode.imagedata.data[a + 1] = t[i + n * qrcode.width] ? 0 : 0;
                qrcode.imagedata.data[a + 2] = t[i + n * qrcode.width] ? 255 : 0
            }
        }
        e.putImageData(qrcode.imagedata, 0, 0)
    }
    var o = new Detector(t);
    var s = o.detect();
    if (qrcode.debug)
        e.putImageData(qrcode.imagedata, 0, 0);
    var h = Decoder.decode(s.bits);
    var l = h.DataByte;
    var c = "";
    for (var f = 0; f < l.length; f++) {
        for (var w = 0; w < l[f].length; w++)
            c += String.fromCharCode(l[f][w])
    }
    var d = (new Date).getTime();
    var u = d - r;
    console.log(u);
    return qrcode.decode_utf8(c)
};
qrcode.getPixel = function(e, r) {
    if (qrcode.width < e) {
        throw "point error"
    }
    if (qrcode.height < r) {
        throw "point error"
    }
    point = e * 4 + r * qrcode.width * 4;
    p = (qrcode.imagedata.data[point] * 33 + qrcode.imagedata.data[point + 1] * 34 + qrcode.imagedata.data[point + 2] * 33) / 100;
    return p
};
qrcode.binarize = function(e) {
    var r = new Array(qrcode.width * qrcode.height);
    for (var t = 0; t < qrcode.height; t++) {
        for (var n = 0; n < qrcode.width; n++) {
            var i = qrcode.getPixel(n, t);
            r[n + t * qrcode.width] = i <= e ? true : false
        }
    }
    return r
};
qrcode.getMiddleBrightnessPerArea = function(e) {
    var r = 4;
    var t = Math.floor(qrcode.width / r);
    var n = Math.floor(qrcode.height / r);
    var i = new Array(r);
    for (var a = 0; a < r; a++) {
        i[a] = new Array(r);
        for (var o = 0; o < r; o++) {
            i[a][o] = new Array(0, 0)
        }
    }
    for (var s = 0; s < r; s++) {
        for (var h = 0; h < r; h++) {
            i[h][s][0] = 255;
            for (var l = 0; l < n; l++) {
                for (var c = 0; c < t; c++) {
                    var f = e[t * h + c + (n * s + l) * qrcode.width];
                    if (f < i[h][s][0])
                        i[h][s][0] = f;
                    if (f > i[h][s][1])
                        i[h][s][1] = f
                }
            }
        }
    }
    var w = new Array(r);
    for (var d = 0; d < r; d++) {
        w[d] = new Array(r)
    }
    for (var s = 0; s < r; s++) {
        for (var h = 0; h < r; h++) {
            w[h][s] = Math.floor((i[h][s][0] + i[h][s][1]) / 2)
        }
    }
    return w
};
qrcode.grayScaleToBitmap = function(e) {
    var r = qrcode.getMiddleBrightnessPerArea(e);
    var t = r.length;
    var n = Math.floor(qrcode.width / t);
    var i = Math.floor(qrcode.height / t);
    var a = new Array(qrcode.height * qrcode.width);
    for (var o = 0; o < t; o++) {
        for (var s = 0; s < t; s++) {
            for (var h = 0; h < i; h++) {
                for (var l = 0; l < n; l++) {
                    a[n * s + l + (i * o + h) * qrcode.width] = e[n * s + l + (i * o + h) * qrcode.width] < r[s][o] ? true : false
                }
            }
        }
    }
    return a
};
qrcode.grayscale = function() {
    var e = new Array(qrcode.width * qrcode.height);
    for (var r = 0; r < qrcode.height; r++) {
        for (var t = 0; t < qrcode.width; t++) {
            var n = qrcode.getPixel(t, r);
            e[t + r * qrcode.width] = n
        }
    }
    return e
};
function URShift(e, r) {
    if (e >= 0)
        return e>>r;
    else 
        return (e>>r) + (2<<~r)
}
var MIN_SKIP = 3;
var MAX_MODULES = 57;
var INTEGER_MATH_SHIFT = 8;
var CENTER_QUORUM = 2;
qrcode.orderBestPatterns = function(e) {
    function r(e, r) {
        xDiff = e.X - r.X;
        yDiff = e.Y - r.Y;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
    }
    function t(e, r, t) {
        var n = r.x;
        var i = r.y;
        return (t.x - n) * (e.y - i) - (t.y - i) * (e.x - n)
    }
    var n = r(e[0], e[1]);
    var i = r(e[1], e[2]);
    var a = r(e[0], e[2]);
    var o, s, h;
    if (i >= n && i >= a) {
        s = e[0];
        o = e[1];
        h = e[2]
    } else if (a >= i && a >= n) {
        s = e[1];
        o = e[0];
        h = e[2]
    } else {
        s = e[2];
        o = e[0];
        h = e[1]
    }
    if (t(o, s, h) < 0) {
        var l = o;
        o = h;
        h = l
    }
    e[0] = o;
    e[1] = s;
    e[2] = h
};
function FinderPattern(e, r, t) {
    this.x = e;
    this.y = r;
    this.count = 1;
    this.estimatedModuleSize = t;
    this.__defineGetter__("EstimatedModuleSize", function() {
        return this.estimatedModuleSize
    });
    this.__defineGetter__("Count", function() {
        return this.count
    });
    this.__defineGetter__("X", function() {
        return this.x
    });
    this.__defineGetter__("Y", function() {
        return this.y
    });
    this.incrementCount = function() {
        this.count++
    };
    this.aboutEquals = function(e, r, t) {
        if (Math.abs(r - this.y) <= e && Math.abs(t - this.x) <= e) {
            var n = Math.abs(e - this.estimatedModuleSize);
            return n <= 1 || n / this.estimatedModuleSize <= 1
        }
        return false
    }
}
function FinderPatternInfo(e) {
    this.bottomLeft = e[0];
    this.topLeft = e[1];
    this.topRight = e[2];
    this.__defineGetter__("BottomLeft", function() {
        return this.bottomLeft
    });
    this.__defineGetter__("TopLeft", function() {
        return this.topLeft
    });
    this.__defineGetter__("TopRight", function() {
        return this.topRight
    })
}
function FinderPatternFinder() {
    this.image = null;
    this.possibleCenters = [];
    this.hasSkipped = false;
    this.crossCheckStateCount = new Array(0, 0, 0, 0, 0);
    this.resultPointCallback = null;
    this.__defineGetter__("CrossCheckStateCount", function() {
        this.crossCheckStateCount[0] = 0;
        this.crossCheckStateCount[1] = 0;
        this.crossCheckStateCount[2] = 0;
        this.crossCheckStateCount[3] = 0;
        this.crossCheckStateCount[4] = 0;
        return this.crossCheckStateCount
    });
    this.foundPatternCross = function(e) {
        var r = 0;
        for (var t = 0; t < 5; t++) {
            var n = e[t];
            if (n == 0) {
                return false
            }
            r += n
        }
        if (r < 7) {
            return false
        }
        var i = Math.floor((r<<INTEGER_MATH_SHIFT) / 7);
        var a = Math.floor(i / 2);
        return Math.abs(i - (e[0]<<INTEGER_MATH_SHIFT)) < a && Math.abs(i - (e[1]<<INTEGER_MATH_SHIFT)) < a && Math.abs(3 * i - (e[2]<<INTEGER_MATH_SHIFT)) < 3 * a && Math.abs(i - (e[3]<<INTEGER_MATH_SHIFT)) < a && Math.abs(i - (e[4]<<INTEGER_MATH_SHIFT)) < a
    };
    this.centerFromEnd = function(e, r) {
        return r - e[4] - e[3] - e[2] / 2
    };
    this.crossCheckVertical = function(e, r, t, n) {
        var i = this.image;
        var a = qrcode.height;
        var o = this.CrossCheckStateCount;
        var s = e;
        while (s >= 0 && i[r + s * qrcode.width]) {
            o[2]++;
            s--
        }
        if (s < 0) {
            return NaN
        }
        while (s >= 0&&!i[r + s * qrcode.width] && o[1] <= t) {
            o[1]++;
            s--
        }
        if (s < 0 || o[1] > t) {
            return NaN
        }
        while (s >= 0 && i[r + s * qrcode.width] && o[0] <= t) {
            o[0]++;
            s--
        }
        if (o[0] > t) {
            return NaN
        }
        s = e + 1;
        while (s < a && i[r + s * qrcode.width]) {
            o[2]++;
            s++
        }
        if (s == a) {
            return NaN
        }
        while (s < a&&!i[r + s * qrcode.width] && o[3] < t) {
            o[3]++;
            s++
        }
        if (s == a || o[3] >= t) {
            return NaN
        }
        while (s < a && i[r + s * qrcode.width] && o[4] < t) {
            o[4]++;
            s++
        }
        if (o[4] >= t) {
            return NaN
        }
        var h = o[0] + o[1] + o[2] + o[3] + o[4];
        if (5 * Math.abs(h - n) >= 2 * n) {
            return NaN
        }
        return this.foundPatternCross(o) ? this.centerFromEnd(o, s) : NaN
    };
    this.crossCheckHorizontal = function(e, r, t, n) {
        var i = this.image;
        var a = qrcode.width;
        var o = this.CrossCheckStateCount;
        var s = e;
        while (s >= 0 && i[s + r * qrcode.width]) {
            o[2]++;
            s--
        }
        if (s < 0) {
            return NaN
        }
        while (s >= 0&&!i[s + r * qrcode.width] && o[1] <= t) {
            o[1]++;
            s--
        }
        if (s < 0 || o[1] > t) {
            return NaN
        }
        while (s >= 0 && i[s + r * qrcode.width] && o[0] <= t) {
            o[0]++;
            s--
        }
        if (o[0] > t) {
            return NaN
        }
        s = e + 1;
        while (s < a && i[s + r * qrcode.width]) {
            o[2]++;
            s++
        }
        if (s == a) {
            return NaN
        }
        while (s < a&&!i[s + r * qrcode.width] && o[3] < t) {
            o[3]++;
            s++
        }
        if (s == a || o[3] >= t) {
            return NaN
        }
        while (s < a && i[s + r * qrcode.width] && o[4] < t) {
            o[4]++;
            s++
        }
        if (o[4] >= t) {
            return NaN
        }
        var h = o[0] + o[1] + o[2] + o[3] + o[4];
        if (5 * Math.abs(h - n) >= n) {
            return NaN
        }
        return this.foundPatternCross(o) ? this.centerFromEnd(o, s) : NaN
    };
    this.handlePossibleCenter = function(e, r, t) {
        var n = e[0] + e[1] + e[2] + e[3] + e[4];
        var i = this.centerFromEnd(e, t);
        var a = this.crossCheckVertical(r, Math.floor(i), e[2], n);
        if (!isNaN(a)) {
            i = this.crossCheckHorizontal(Math.floor(i), Math.floor(a), e[2], n);
            if (!isNaN(i)) {
                var o = n / 7;
                var s = false;
                var h = this.possibleCenters.length;
                for (var l = 0; l < h; l++) {
                    var c = this.possibleCenters[l];
                    if (c.aboutEquals(o, a, i)) {
                        c.incrementCount();
                        s = true;
                        break
                    }
                }
                if (!s) {
                    var f = new FinderPattern(i, a, o);
                    this.possibleCenters.push(f);
                    if (this.resultPointCallback != null) {
                        this.resultPointCallback.foundPossibleResultPoint(f)
                    }
                }
                return true
            }
        }
        return false
    };
    this.selectBestPatterns = function() {
        var e = this.possibleCenters.length;
        if (e < 3) {
            throw "Couldn't find enough finder patterns"
        }
        if (e > 3) {
            var r = 0;
            var t = 0;
            for (var n = 0; n < e; n++) {
                var i = this.possibleCenters[n].EstimatedModuleSize;
                r += i;
                t += i * i
            }
            var a = r / e;
            this.possibleCenters.sort(function(e, r) {
                var t = Math.abs(r.EstimatedModuleSize - a);
                var n = Math.abs(e.EstimatedModuleSize - a);
                if (t < n) {
                    return - 1
                } else if (t == n) {
                    return 0
                } else {
                    return 1
                }
            });
            var o = Math.sqrt(t / e - a * a);
            var s = Math.max(.2 * a, o);
            for (var n = 0; n < this.possibleCenters.length && this.possibleCenters.length > 3; n++) {
                var h = this.possibleCenters[n];
                if (Math.abs(h.EstimatedModuleSize - a) > s) {
                    this.possibleCenters.splice(n, 1);
                    n--
                }
            }
        }
        if (this.possibleCenters.length > 3) {
            this.possibleCenters.sort(function(e, r) {
                if (e.count > r.count) {
                    return - 1
                }
                if (e.count < r.count) {
                    return 1
                }
                return 0
            })
        }
        return new Array(this.possibleCenters[0], this.possibleCenters[1], this.possibleCenters[2])
    };
    this.findRowSkip = function() {
        var e = this.possibleCenters.length;
        if (e <= 1) {
            return 0
        }
        var r = null;
        for (var t = 0; t < e; t++) {
            var n = this.possibleCenters[t];
            if (n.Count >= CENTER_QUORUM) {
                if (r == null) {
                    r = n
                } else {
                    this.hasSkipped = true;
                    return Math.floor((Math.abs(r.X - n.X) - Math.abs(r.Y - n.Y)) / 2)
                }
            }
        }
        return 0
    };
    this.haveMultiplyConfirmedCenters = function() {
        var e = 0;
        var r = 0;
        var t = this.possibleCenters.length;
        for (var n = 0; n < t; n++) {
            var i = this.possibleCenters[n];
            if (i.Count >= CENTER_QUORUM) {
                e++;
                r += i.EstimatedModuleSize
            }
        }
        if (e < 3) {
            return false
        }
        var a = r / t;
        var o = 0;
        for (var n = 0; n < t; n++) {
            i = this.possibleCenters[n];
            o += Math.abs(i.EstimatedModuleSize - a)
        }
        return o <= .05 * r
    };
    this.findFinderPattern = function(e) {
        var r = false;
        this.image = e;
        var t = qrcode.height;
        var n = qrcode.width;
        var i = Math.floor(3 * t / (4 * MAX_MODULES));
        if (i < MIN_SKIP || r) {
            i = MIN_SKIP
        }
        var a = false;
        var o = new Array(5);
        for (var s = i - 1; s < t&&!a; s += i) {
            o[0] = 0;
            o[1] = 0;
            o[2] = 0;
            o[3] = 0;
            o[4] = 0;
            var h = 0;
            for (var l = 0; l < n; l++) {
                if (e[l + s * qrcode.width]) {
                    if ((h & 1) == 1) {
                        h++
                    }
                    o[h]++
                } else {
                    if ((h & 1) == 0) {
                        if (h == 4) {
                            if (this.foundPatternCross(o)) {
                                var c = this.handlePossibleCenter(o, s, l);
                                if (c) {
                                    i = 2;
                                    if (this.hasSkipped) {
                                        a = this.haveMultiplyConfirmedCenters()
                                    } else {
                                        var f = this.findRowSkip();
                                        if (f > o[2]) {
                                            s += f - o[2] - i;
                                            l = n - 1
                                        }
                                    }
                                } else {
                                    do {
                                        l++
                                    }
                                    while (l < n&&!e[l + s * qrcode.width]);
                                    l--
                                }
                                h = 0;
                                o[0] = 0;
                                o[1] = 0;
                                o[2] = 0;
                                o[3] = 0;
                                o[4] = 0
                            } else {
                                o[0] = o[2];
                                o[1] = o[3];
                                o[2] = o[4];
                                o[3] = 1;
                                o[4] = 0;
                                h = 3
                            }
                        } else {
                            o[++h]++
                        }
                    } else {
                        o[h]++
                    }
                }
            }
            if (this.foundPatternCross(o)) {
                var c = this.handlePossibleCenter(o, s, n);
                if (c) {
                    i = o[0];
                    if (this.hasSkipped) {
                        a = haveMultiplyConfirmedCenters()
                    }
                }
            }
        }
        var w = this.selectBestPatterns();
        qrcode.orderBestPatterns(w);
        return new FinderPatternInfo(w)
    }
}
function AlignmentPattern(e, r, t) {
    this.x = e;
    this.y = r;
    this.count = 1;
    this.estimatedModuleSize = t;
    this.__defineGetter__("EstimatedModuleSize", function() {
        return this.estimatedModuleSize
    });
    this.__defineGetter__("Count", function() {
        return this.count
    });
    this.__defineGetter__("X", function() {
        return Math.floor(this.x)
    });
    this.__defineGetter__("Y", function() {
        return Math.floor(this.y)
    });
    this.incrementCount = function() {
        this.count++
    };
    this.aboutEquals = function(e, r, t) {
        if (Math.abs(r - this.y) <= e && Math.abs(t - this.x) <= e) {
            var n = Math.abs(e - this.estimatedModuleSize);
            return n <= 1 || n / this.estimatedModuleSize <= 1
        }
        return false
    }
}
function AlignmentPatternFinder(e, r, t, n, i, a, o) {
    this.image = e;
    this.possibleCenters = new Array;
    this.startX = r;
    this.startY = t;
    this.width = n;
    this.height = i;
    this.moduleSize = a;
    this.crossCheckStateCount = new Array(0, 0, 0);
    this.resultPointCallback = o;
    this.centerFromEnd = function(e, r) {
        return r - e[2] - e[1] / 2
    };
    this.foundPatternCross = function(e) {
        var r = this.moduleSize;
        var t = r / 2;
        for (var n = 0; n < 3; n++) {
            if (Math.abs(r - e[n]) >= t) {
                return false
            }
        }
        return true
    };
    this.crossCheckVertical = function(e, r, t, n) {
        var i = this.image;
        var a = qrcode.height;
        var o = this.crossCheckStateCount;
        o[0] = 0;
        o[1] = 0;
        o[2] = 0;
        var s = e;
        while (s >= 0 && i[r + s * qrcode.width] && o[1] <= t) {
            o[1]++;
            s--
        }
        if (s < 0 || o[1] > t) {
            return NaN
        }
        while (s >= 0&&!i[r + s * qrcode.width] && o[0] <= t) {
            o[0]++;
            s--
        }
        if (o[0] > t) {
            return NaN
        }
        s = e + 1;
        while (s < a && i[r + s * qrcode.width] && o[1] <= t) {
            o[1]++;
            s++
        }
        if (s == a || o[1] > t) {
            return NaN
        }
        while (s < a&&!i[r + s * qrcode.width] && o[2] <= t) {
            o[2]++;
            s++
        }
        if (o[2] > t) {
            return NaN
        }
        var h = o[0] + o[1] + o[2];
        if (5 * Math.abs(h - n) >= 2 * n) {
            return NaN
        }
        return this.foundPatternCross(o) ? this.centerFromEnd(o, s) : NaN
    };
    this.handlePossibleCenter = function(e, r, t) {
        var n = e[0] + e[1] + e[2];
        var i = this.centerFromEnd(e, t);
        var a = this.crossCheckVertical(r, Math.floor(i), 2 * e[1], n);
        if (!isNaN(a)) {
            var o = (e[0] + e[1] + e[2]) / 3;
            var s = this.possibleCenters.length;
            for (var h = 0; h < s; h++) {
                var l = this.possibleCenters[h];
                if (l.aboutEquals(o, a, i)) {
                    return new AlignmentPattern(i, a, o)
                }
            }
            var c = new AlignmentPattern(i, a, o);
            this.possibleCenters.push(c);
            if (this.resultPointCallback != null) {
                this.resultPointCallback.foundPossibleResultPoint(c)
            }
        }
        return null
    };
    this.find = function() {
        var r = this.startX;
        var i = this.height;
        var a = r + n;
        var o = t + (i>>1);
        var s = new Array(0, 0, 0);
        for (var h = 0; h < i; h++) {
            var l = o + ((h & 1) == 0 ? h + 1>>1 : - (h + 1>>1));
            s[0] = 0;
            s[1] = 0;
            s[2] = 0;
            var c = r;
            while (c < a&&!e[c + qrcode.width * l]) {
                c++
            }
            var f = 0;
            while (c < a) {
                if (e[c + l * qrcode.width]) {
                    if (f == 1) {
                        s[f]++
                    } else {
                        if (f == 2) {
                            if (this.foundPatternCross(s)) {
                                var w = this.handlePossibleCenter(s, l, c);
                                if (w != null) {
                                    return w
                                }
                            }
                            s[0] = s[2];
                            s[1] = 1;
                            s[2] = 0;
                            f = 1
                        } else {
                            s[++f]++
                        }
                    }
                } else {
                    if (f == 1) {
                        f++
                    }
                    s[f]++
                }
                c++
            }
            if (this.foundPatternCross(s)) {
                var w = this.handlePossibleCenter(s, l, a);
                if (w != null) {
                    return w
                }
            }
        }
        if (!(this.possibleCenters.length == 0)) {
            return this.possibleCenters[0]
        }
        throw "Couldn't find enough alignment patterns"
    }
}
function QRCodeDataBlockReader(e, r, t) {
    this.blockPointer = 0;
    this.bitPointer = 7;
    this.dataLength = 0;
    this.blocks = e;
    this.numErrorCorrectionCode = t;
    if (r <= 9)
        this.dataLengthMode = 0;
    else if (r >= 10 && r <= 26)
        this.dataLengthMode = 1;
    else if (r >= 27 && r <= 40)
        this.dataLengthMode = 2;
    this.getNextBits = function(e) {
        var r = 0;
        if (e < this.bitPointer + 1) {
            var t = 0;
            for (var n = 0; n < e; n++) {
                t += 1<<n
            }
            t<<=this.bitPointer - e + 1;
            r = (this.blocks[this.blockPointer] & t)>>this.bitPointer - e + 1;
            this.bitPointer -= e;
            return r
        } else if (e < this.bitPointer + 1 + 8) {
            var i = 0;
            for (var n = 0; n < this.bitPointer + 1; n++) {
                i += 1<<n
            }
            r = (this.blocks[this.blockPointer] & i)<<e - (this.bitPointer + 1);
            this.blockPointer++;
            r += this.blocks[this.blockPointer]>>8 - (e - (this.bitPointer + 1));
            this.bitPointer = this.bitPointer - e%8;
            if (this.bitPointer < 0) {
                this.bitPointer = 8 + this.bitPointer
            }
            return r
        } else if (e < this.bitPointer + 1 + 16) {
            var i = 0;
            var a = 0;
            for (var n = 0; n < this.bitPointer + 1; n++) {
                i += 1<<n
            }
            var o = (this.blocks[this.blockPointer] & i)<<e - (this.bitPointer + 1);
            this.blockPointer++;
            var s = this.blocks[this.blockPointer]<<e - (this.bitPointer + 1 + 8);
            this.blockPointer++;
            for (var n = 0; n < e - (this.bitPointer + 1 + 8); n++) {
                a += 1<<n
            }
            a<<=8 - (e - (this.bitPointer + 1 + 8));
            var h = (this.blocks[this.blockPointer] & a)>>8 - (e - (this.bitPointer + 1 + 8));
            r = o + s + h;
            this.bitPointer = this.bitPointer - (e - 8)%8;
            if (this.bitPointer < 0) {
                this.bitPointer = 8 + this.bitPointer
            }
            return r
        } else {
            return 0
        }
    };
    this.NextMode = function() {
        if (this.blockPointer > this.blocks.length - this.numErrorCorrectionCode - 2)
            return 0;
        else 
            return this.getNextBits(4)
    };
    this.getDataLength = function(e) {
        var r = 0;
        while (true) {
            if (e>>r == 1)
                break;
            r++
        }
        return this.getNextBits(qrcode.sizeOfDataLengthInfo[this.dataLengthMode][r])
    };
    this.getRomanAndFigureString = function(e) {
        var r = e;
        var t = 0;
        var n = "";
        var i = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":");
        do {
            if (r > 1) {
                t = this.getNextBits(11);
                var a = Math.floor(t / 45);
                var o = t%45;
                n += i[a];
                n += i[o];
                r -= 2
            } else if (r == 1) {
                t = this.getNextBits(6);
                n += i[t];
                r -= 1
            }
        }
        while (r > 0);
        return n
    };
    this.getFigureString = function(e) {
        var r = e;
        var t = 0;
        var n = "";
        do {
            if (r >= 3) {
                t = this.getNextBits(10);
                if (t < 100)
                    n += "0";
                if (t < 10)
                    n += "0";
                r -= 3
            } else if (r == 2) {
                t = this.getNextBits(7);
                if (t < 10)
                    n += "0";
                r -= 2
            } else if (r == 1) {
                t = this.getNextBits(4);
                r -= 1
            }
            n += t
        }
        while (r > 0);
        return n
    };
    this.get8bitByteArray = function(e) {
        var r = e;
        var t = 0;
        var n = new Array;
        do {
            t = this.getNextBits(8);
            n.push(t);
            r--
        }
        while (r > 0);
        return n
    };
    this.getKanjiString = function(e) {
        var r = e;
        var t = 0;
        var n = "";
        do {
            t = getNextBits(13);
            var i = t%192;
            var a = t / 192;
            var o = (a<<8) + i;
            var s = 0;
            if (o + 33088 <= 40956) {
                s = o + 33088
            } else {
                s = o + 49472
            }
            n += String.fromCharCode(s);
            r--
        }
        while (r > 0);
        return n
    };
    this.__defineGetter__("DataByte", function() {
        var e = new Array;
        var r = 1;
        var t = 2;
        var n = 3;
        var i = 4;
        var a = 8;
        do {
            var o = this.NextMode();
            if (o == 0) {
                if (e.length > 0)
                    break;
                else 
                    throw "Empty data block"
            }
            if (o == n) {
                this.getNextBits(4);
                this.getNextBits(4);
                this.getNextBits(8);
                o = this.getNextBits(4)
            }
            if (o != r && o != t && o != i && o != a) {
                throw "Invalid mode: " + o + " in (block:" + this.blockPointer + " bit:" + this.bitPointer + ")"
            }
            dataLength = this.getDataLength(o);
            if (dataLength < 1)
                throw "Invalid data length: " + dataLength;
            switch (o) {
            case r:
                var s = this.getFigureString(dataLength);
                var h = new Array(s.length);
                for (var l = 0; l < s.length; l++)
                    h[l] = s.charCodeAt(l);
                e.push(h);
                break;
            case t:
                var s = this.getRomanAndFigureString(dataLength);
                var h = new Array(s.length);
                for (var l = 0; l < s.length; l++)
                    h[l] = s.charCodeAt(l);
                e.push(h);
                break;
            case i:
                var c = this.get8bitByteArray(dataLength);
                e.push(c);
                break;
            case a:
                var s = this.getKanjiString(dataLength);
                e.push(s);
                break
            }
        }
        while (true);
        return e
    })
}
//# sourceMappingURL=jsqrcode.map

