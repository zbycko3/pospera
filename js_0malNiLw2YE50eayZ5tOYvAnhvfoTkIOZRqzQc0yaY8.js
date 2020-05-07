(function ($) {
Drupal.behaviors.PRE_INSERIMENTO = {
    attach: function(context, settings) {
	$(document).ready(function () {
		//$('#edit-categoria').empty().append($("<option></option>").attr('value',"-1").text('- -'));
		
		$('#edit-macrocategoria').change(function() {
		var tid = $(this).val();
		//$('#edit-categoria').empty().append($("<option></option>").attr('value',"-1").text('- Caricamento -'));
		$.getJSON("/json/getCategoryFromMacro",{'tid' : tid},function(result) {
			//alert(data);
			
//			$('#edit-categoria').empty().append($("<option></option>").attr('value',"-1").text('- Non specificato -'));
			if (result.status < 0) {
				alert(result.msg);
				return;
			}
			
			$.each(result.tax, function(value,key) {
//				$('#edit-categoria').append($("<option></option>").attr("value", value).text(key));
			});
		});
	});

	});
	
		}
	};

})(jQuery);
;
function addBookmark(nid) {
    /*if (getCookie("Drupal.visitor.is_anonymous")) {
     var nid2 = getCookie("Drupal.visitor.bookmark")+nid;
     //alert(nid2);
     nid = nid2;
     }
     */

    jQuery.getJSON("/annuncio/addBookmark/" + nid, {}, function(result) {
        alert(result.msg);
        if (result.code < 0) {
            return false;
        }

        //Aggiorno il numero dei bookmark
        jQuery("#bookmarks").html(result.count);
    });
}

function addVersus(nid) {
    jQuery.getJSON("/annuncio/addVersus/" + nid, {}, function(result) {
        alert(result.msg);
        if (result.code < 0) {
            return false;
        }

        //Aggiorno il numero dei bookmark
        jQuery("#versus").html(result.count);
    });
}

function svuotaBookmark() {
    jQuery.getJSON("/annuncio/removeAllBookmark", {}, function(result) {
        jQuery("#bookmarks").html(0);
        jQuery('.view-flag-bookmarks').html("Lista eliminata");
    });


}

function svuotaVersus() {
    jQuery(".flag-versus").each(function() {
        //var href = 
        var child = jQuery(this).children();
        var href = child[0].href;
        jQuery.getJSON(href, {}, function() {
        });
    });
    jQuery("#versus").html(0);
    jQuery('.view-flag-bookmarks').html("Lista eliminata");
}

function svuotaBookmarkAnonimo() {
    jQuery.cookie("Drupal.visitor.bookmark", null);
    jQuery('#divListaPref').html("Lista eliminata");
    jQuery("#bookmarks").html(0);
}

function svuotaVersusAnon() {
    jQuery.cookie("Drupal.visitor.versus", null);
    jQuery('#divListaConfr').html("Lista eliminata");
    jQuery("#versus").html(0);
}


Drupal.behaviors.DELETE_BOOKMARK = {
    attach: function(context, settings) {
        if (getCookie("Drupal.visitor.is_anonymous")) {
            /*jQuery("a.flag-unbookmarks").click(function (event) {
             event.preventDefault();
             var nid = jQuery(this).attr('nid');
             jQuery.getJSON("/annuncio/removeBookmarkAnonymous/"+nid,{},function (result) {
             jQuery("#bookmarks").html(result.count);
             });
             //jQuery(this).parent().parent().parent().parent().parent().hide();
             jQuery(this).parent().parent().hide();
             });
             */
            jQuery("a.flag-unversus").click(function(event) {
                event.preventDefault();
                var nid = jQuery(this).attr('nid');
                jQuery.getJSON("/annuncio/removeVersusAnonymous/	" + nid, {}, function(result) {

                    jQuery("#versus").html(result.count);
                    inlineListaVersusAnon();
                });
                //jQuery(this).parent().parent().hide();
            });
        }
        else {
            jQuery("a.flag-bookmarks").click(function(event) {
                event.preventDefault();
                jQuery.getJSON(jQuery(this).children()[0].href, {bookmark_mw: 1}, function(result) {
                    jQuery("#versus").html(result.count);
                });
                jQuery(this).parent().parent().hide();

            });
        }
    }
}

function verifyEmail(s) {
    var chrs = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-@';
    var sLen = s.length;
    var i = 0, c = 0, cCnt = 0, step = 0;
    if (sLen < 6)
        return false;
    if (s.indexOf('@.') >= 0)
        return false;
    if (s.indexOf('.@') >= 0)
        return false;
    while (i < sLen) {
        c = s.charAt(i);
        if (!(chrs.indexOf(c) >= 0 || (c == '_' && step < 1)))
            return false;
        if (c == '.') {
            if (cCnt < 1)
                return false;
            cCnt = 0;
        }
        if (c == '@') {
            if (step > 0)
                return false;
            if (cCnt < 1)
                return false;
            step++;
            cCnt = 0;
        }
        cCnt = cCnt + 1;
        i++;
    }
    if (cCnt < 3 || cCnt > 5 || step == 0 || (s.indexOf(".") < 0))
        return false;
    return true;
}

function emptyEmailSegnalaAmico() {
    jQuery('#.form-item-email-segnala-amico > .form-text').attr('value', '');
}

jQuery(document).ready(function() {
    /* Using custom settings */
    jQuery("a#inline-saveSearch").fancybox({
        'titleShow': false
    });

    jQuery("a#segnalaAmico").fancybox({autoDimensions: false, height: 470});
    /*jQuery("a#segnalaAmico").click(function () {
     var nid = jQuery(this).attr('rel_nid');
     jQuery("div#divSegnalaAmico").html("Caricamento in corso...");
     jQuery.getJSON('/annuncio/segnala_amicoJSON',{id: nid},function (result) {
     ///annuncio/segnala_amicoJSON?id=<?php echo $node->nid; ?>
     jQuery("div#divSegnalaAmico").html(result.form);
     bindSegnalaAmicoForm(nid);
     
     });
     });
     */

    function bindSegnalaAmicoForm(nid) {
        jQuery("#segnala-amico-form-3").bind("submit", function(e) {
            e.preventDefault();

            var error = '';
            if (jQuery('#edit-nome').val() == '') {
                jQuery('#edit-nome').addClass('error');
                error = error + ' Il campo nome deve essere compilato\n';
            }

            if (!verifyEmail(jQuery('#edit-email-segnala-amico').val())) {
                jQuery('#edit-email-segnala-amico').addClass('error');
                error = error + ' Il campo email non è corretto\n';
            }

            if (jQuery('#edit-msg-segnala-amico').val() == '') {
                jQuery('#edit-msg-segnala-amico').addClass('error');
                error = error + ' Il campo messaggio deve essere compilato\n';
            }

            if (jQuery('form#segnala-amico-form-3 #edit-captcha-response').val() == '') {
                jQuery('form#segnala-amico-form-3 #edit-captcha-response').addClass('error');
                error = error + ' Il campo del calcolo di verifica deve essere compilato\n';
            }

            if (error != '') {
                alert(error);
                return false;
            }

            //jQuery.fancybox.showActivity();

            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: 'json',
                url: "/annuncio/segnala_amicoJSON?id=" + nid,
                data: jQuery(this).serializeArray(),
                success: function(data) {
                    jQuery("div#divSegnalaAmico").html(data.form);
                    bindSegnalaAmicoForm(nid);
                    jQuery.fancybox.resize();
                }
            });

            return false;
        });
    }

    jQuery("a#segnalaAbuso").fancybox({autoDimensions: false, height: 470});
    /*jQuery("a#segnalaAbuso").click(function () {
     var nid = jQuery(this).attr('rel_nid');
     jQuery("div#divSegnalaAbuso").html("Caricamento in corso...");
     jQuery.getJSON('/annuncio/segnala_abusoJSON',{id: nid},function (result) {
     ///annuncio/segnala_amicoJSON?id=<?php echo $node->nid; ?>
     jQuery("div#divSegnalaAbuso").html(result.form);
     //bindSegnalaAmicoForm(nid);
     
     });
     });
     */
    // /annuncio/segnala_abuso


});

function checkNrTableVersus() {
    jQuery('.view-flag-bookmarks table').each(function() {
        if (jQuery(this)[0]['children'][2]['childElementCount'] == 1) {
            jQuery(this)[0]['caption']['children'][0]['childNodes'][2]['outerHTML'] = 'Inserire almeno un altro annuncio per effettuare il confronto';
        }
    });
}

function inlineListaVersusAnon() {
    jQuery("#divListaConfr").html("Caricamento in corso...");
    jQuery.getJSON('/myAnnunci/versus_anonymousJSON', {}, function(result) {
        jQuery("#divListaConfr").html(result.data);
        jQuery('.flag-unversus').click(function(e) {
            e.preventDefault();
            var jThis = jQuery(this);
            var nid = jQuery(this).attr('nid');
            jQuery.getJSON("/annuncio/removeVersusAnonymous/	" + nid, {}, function(result) {

                jQuery("#versus").html(result.count);
                alert(result.msg);
                jThis.parent().parent().hide();
                inlineListaVersusAnon();
            });
        });

    });

}
function inlineListaVersus() {
    jQuery("#divListaConfr").html("Caricamento in corso...");
    jQuery.getJSON('/myAnnunci/versusJSON', {}, function(result) {
        jQuery("#divListaConfr").html(result.data);
        checkNrTableVersus();
        jQuery('.flag-link-toggle').click(function(e) {
            e.preventDefault();
            jQuery.getJSON(jQuery(this).attr('href'), {}, function(result2) {
                var r = jQuery('#versus').html();
                r = r - 1;
                jQuery('#versus').html(r);
            });
            jQuery(this).parent().parent().parent().hide();
            inlineListaVersus();
        });
    });
}

function AFF1(linkId) {
var string1, string2, string3, string4, string5, stringConcatenated;
string1 = "http://www.";
string2 = "trovi";
string3 = "lavoro.it/ext";
string4 = linkId;
string5 = ".html";
stringConcatenated = string1 + string2 + string3 + string4 + string5; 
var AFF1 = window.open(stringConcatenated);

}

function AB1() {

var string1;

string1 = "<a href='http://www.ashleyrnadison.com/A112507' target='_blank'><img src='http://www.annunci.net/images/adv/am/am550x145_jtwbssc_it.gif'/></a><br><br> \
	   <table class='list' width='100%' cellpadding='0' cellspacing='0'> \
            <tbody> \
			<tr class=''> \
							<td class='article'> \
								<h2 class='marginbottom5'><a href='http://verticalaffiliation.com/incontri/52545900778a6/575985da.html' target='_blank' onclick=\"_gaq.push(['_trackEvent','outgoing_links','listing_spd'])\">Incontra donne e uomini nella tua citt&agrave;</a></h2> \
								<a href='http://verticalaffiliation.com/incontri/52545900778a6/575985da.html' target='_blank' onclick=\"_gaq.push(['_trackEvent','outgoing_links','listing_spd'])\"><img src='/images/adv/94x72_ago1.jpg' align='left'></a> \
								<span class='blu data'>[31-05-2013]</span> \
								<img style='border:0' src='http://verticalaffiliation.com/affiliate/scripts/imp.php?a_aid=52545900778a6&amp;a_bid=575985da' width='1' height='1' alt='' /> \
								<br> \
								Incontri piccanti nella tua citt&agrave;! Cercami tra centinaia di annunci molto HOT...<br> \
								<a href='/incontri-adulti' class='gray' style='line-height: 20px;'>[Solo per adulti]</a> \
								<div class='clear'></div> \
							</td> \
							<td class='alignright actions'> \
																<span class='price'>&nbsp;</span> \
																	<div class='marginbottom10'><span class='bold blu'>Luogo</span>Tutta Italia</div> \
									<ul class='margintop10'> \
																				  <li><span class='privato gray bold'>Privato</span></li> \
									</ul> \
							</td> \
			</tr> \
</tbody></table>";

document.write(string1);

}

function AB2() {

var string2;

string2 = "<a href='http://verticalaffiliation.com/incontri/52545900778a6/7e1f0ade.html' target='_blank'><img src='http://verticalaffiliation.com/affiliate/accounts/default1/banners/7e1f0ade.gif' width='300' height='250' /></a><img style='border:0' src='http://verticalaffiliation.com/affiliate/scripts/imp.php?a_aid=52545900778a6&amp;a_bid=7e1f0ade' width='1' height='1' alt='' />";

document.write(string2);

}

function AB3() {

var string3;

string3 = "<a href='http://verticalaffiliation.com/incontri/52545900778a6/7e1f0ade.html' target='_blank'><img src='http://www.annunci.net/images/adv/kiss.gif' width='420' height='30' /></a><img style='border:0' src='http://verticalaffiliation.com/affiliate/scripts/imp.php?a_aid=52545900778a6&amp;a_bid=7e1f0ade' width='1' height='1' alt='' />";

document.write(string3);

}
;
function setCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) {
    setCookie(name,"",-1);
};
/*
 * Browser Detection
 * � 2010 DevSlide Labs 
 * 
 * Visit us at: www.devslide.com/labs
 */
var notSupportedBrowsers = [{'os': 'Any', 'browser': 'MSIE', 'version': 7}];
var notSupportedBrowsers = [];
var displayPoweredBy = true;
var noticeLang = 'professional';
var noticeLangCustom = null;
var supportedBrowsers = [];

var BrowserDetection = {
	init: function(){
		if(notSupportedBrowsers == null || notSupportedBrowsers.length < 1){
			notSupportedBrowsers = this.defaultNotSupportedBrowsers;
		}
		
		this.detectBrowser();
		this.detectOS();
		
		if(this.browser == '' || this.browser == 'Unknown' || this.os == '' || 
		   this.os == 'Unknown' || this.browserVersion == '' || this.browserVersion == 0)
		{
			return;
		}
		
		// Check if this is old browser
		var oldBrowser = false;
		for(var i = 0; i < notSupportedBrowsers.length; i++){
			if(notSupportedBrowsers[i].os == 'Any' || notSupportedBrowsers[i].os == this.os){
				if(notSupportedBrowsers[i].browser == 'Any' || notSupportedBrowsers[i].browser == this.browser){
					if(notSupportedBrowsers[i].version == "Any" || this.browserVersion <= parseFloat(notSupportedBrowsers[i].version)){
						oldBrowser = true;
						break;
					}
				} 
			}
		}
		
		if(oldBrowser){
			this.displayNotice();
		}
	},
	
	getEl: function(id){ return window.document.getElementById(id); },
	getElSize: function(id){ 
		var el = this.getEl(id); 
		if(el == null){ return null; } 
		return { 'width': parseInt(el.offsetWidth), 'height': parseInt(el.offsetHeight) }; 
	},
	getWindowSize: function(){
		if(typeof window.innerWidth != 'undefined'){
			return {'width': parseInt(window.innerWidth), 'height': parseInt(window.innerHeight)};
		} else {
			if(window.document.documentElement.clientWidth != 0){
				return {'width': parseInt(window.document.documentElement.clientWidth), 'height': parseInt(window.document.documentElement.clientHeight)};
			} else {
				return {'width': parseInt(window.document.body.clientWidth), 'height': parseInt(window.document.body.clientHeight)};
			}
		}
	},
	positionNotice: function(){
		var noticeSize = this.getElSize('browser-detection');
		var windowSize = this.getWindowSize();
		var noticeEl = this.getEl('browser-detection');
		
		if(noticeEl == null || noticeSize == null || windowSize == null || !windowSize.width || !windowSize.height){ return; }
		noticeEl.style.left = (windowSize.width - noticeSize.width) / 2 + "px";
		
		var offset = (this.browser == "MSIE" && this.browserVersion < 7) ? (window.document.documentElement.scrollTop != 0 ? window.document.documentElement.scrollTop : window.document.body.scrollTop) : 0;
		noticeEl.style.top = (windowSize.height - noticeSize.height - 20 + offset) + "px";
		this.noticeHeight = noticeSize.height;
	},
	
	displayNotice: function(){
		if(this.readCookie('bdnotice') == 1){
			return;
		}
		
		this.writeNoticeCode();
		this.positionNotice();
		
		var el = this;
		window.onresize = function(){ el.positionNotice(); };
		if(this.browser == "MSIE" && this.browserVersion < 7){
			window.onscroll = function(){ el.positionNotice(); };
		}
		
		this.getEl('browser-detection-close').onclick = function(){ el.remindMe(false); };
		this.getEl('browser-detection-remind-later').onclick = function(){ el.remindMe(false); };
		this.getEl('browser-detection-never-remind').onclick = function(){ el.remindMe(true); };
	},
	
	remindMe: function(never){
		this.writeCookie('bdnotice', 1, never == true ? 365 : 7);
		this.getEl('browser-detection').style.display = 'none';
		this.getEl('black_overlay').style.display = 'none';
	},
	
	writeCookie: function(name, value, days){
		var expiration = ""; 
		if(parseInt(days) > 0){
			var date = new Date();
			date.setTime(date.getTime() + parseInt(days) * 24 * 60 * 60 * 1000);
			expiration = '; expires=' + date.toGMTString();
		}
		
		document.cookie = name + '=' + value + expiration + '; path=/';
	},
	
	readCookie: function(name){
		if(!document.cookie){ return ''; }
		
		var searchName = name + '='; 
		var data = document.cookie.split(';');
		
		for(var i = 0; i < data.length; i++){
			while(data[i].charAt(0) == ' '){
				data[i] = data[i].substring(1, data[i].length);
			}
			
			if(data[i].indexOf(searchName) == 0){ 
				return data[i].substring(searchName.length, data[i].length);
			}
		}
		
		return '';
	},
	
	writeNoticeCode: function(){
		var title = '';
		var notice = '';
		var selectBrowser = '';
		var remindMeLater = '';
		var neverRemindAgain = '';
		
		var browsersList = null;		
		var code = '<div id="black_overlay"></div><div id="browser-detection"><a href="javascript:;" id="browser-detection-close">Close</a>';
		
		if(noticeLang == 'custom' && noticeLangCustom != null){
			title = noticeLangCustom.title;
			notice = noticeLangCustom.notice;
			selectBrowser = noticeLangCustom.selectBrowser;
			remindMeLater = noticeLangCustom.remindMeLater;
			neverRemindAgain = noticeLangCustom.neverRemindAgain;
		} else {
			var noticeTextObj = null;
			eval('noticeTextObj = this.noticeText.' + noticeLang + ';');
			
			if(!noticeTextObj){
				noticeTextObj = this.noticeText.professional;
			}
			
			title = noticeTextObj.title;
			notice = noticeTextObj.notice;
			selectBrowser = noticeTextObj.selectBrowser;
			remindMeLater = noticeTextObj.remindMeLater;
			neverRemindAgain = noticeTextObj.neverRemindAgain;
		}
		
		notice = notice.replace("\n", '</p><p class="bd-notice">');
		notice = notice.replace("{browser_name}", (this.browser + " " + this.browserVersion));
		
		code += '<p class="bd-title">' + title + '</p><p class="bd-notice">' + notice + '</p><p class="bd-notice"><b>' + selectBrowser + '</b></p>';
		
		if(supportedBrowsers.length > 0){
			browsersList = supportedBrowsers;
		} else {
			browsersList = this.supportedBrowsers;
		}
		
		code += '<ul class="bd-browsers-list">';
		for(var i = 0; i < browsersList.length; i++){
			code += '<li class="' + browsersList[i].cssClass + '"><a href="' + browsersList[i].downloadUrl + '" target="_blank">' + browsersList[i].name + '</a></li>';
		}		
		code += '</ul>';
		
		if(displayPoweredBy){
			code += '<div class="bd-poweredby">Powered by <a href="http://www.devslide.com/labs/browser-detection" target="_blank">DevSlide Labs</a></div>';
		}
		
		code += '<ul class="bd-skip-buttons">';
		code += '<li><button id="browser-detection-remind-later" type="button">' + remindMeLater + '</button></li>';
		code += '<li><button id="browser-detection-never-remind" type="button">' + neverRemindAgain + '</button></li>';
		code += '</ul>';
		code += '</div>';
		window.document.body.innerHTML += code;
	},

	detectBrowser: function(){
		this.browser = '';
		this.browserVersion = 0;
		
		if(/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			this.browser = 'Opera';
		} else if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
			this.browser = 'MSIE';
		} else if(/Navigator[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			this.browser = 'Netscape';
		} else if(/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			this.browser = 'Chrome';
		} else if(/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			this.browser = 'Safari';
			/Version[\/\s](\d+\.\d+)/.test(navigator.userAgent);
			this.browserVersion = new Number(RegExp.$1);
		} else if(/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			this.browser = 'Firefox';
		}
		
		if(this.browser == ''){
			this.browser = 'Unknown';
		} else if(this.browserVersion == 0) {
			this.browserVersion = parseFloat(new Number(RegExp.$1));
		}		
	},
	
	// Detect operation system
	detectOS: function(){
		for(var i = 0; i < this.operatingSystems.length; i++){
			if(this.operatingSystems[i].searchString.indexOf(this.operatingSystems[i].subStr) != -1){
				this.os = this.operatingSystems[i].name;
				return;
			}
		}
		
		this.os = "Unknown";
	},
	
	//	Variables
	noticeHeight: 0,
	browser: '',
	os: '',
	browserVersion: '',
	supportedBrowsers: [
	       { 'cssClass': 'firefox', 'name': 'Mozilla Firefox', 'downloadUrl': 'http://www.getfirefox.com/' },
	       { 'cssClass': 'chrome', 'name': 'Google Chrome', 'downloadUrl': 'http://www.google.com/chrome/' },
	       { 'cssClass': 'msie', 'name': 'Internet Explorer', 'downloadUrl': 'http://www.getie.com/' },
	       { 'cssClass': 'opera', 'name': 'Opera', 'downloadUrl': 'http://www.opera.com/' },
	       { 'cssClass': 'safari', 'name': 'Apple Safari', 'downloadUrl': 'http://www.apple.com/safari/' }
	],
	operatingSystems: [
           { 'searchString': navigator.platform, 'name': 'Windows', 'subStr': 'Win' },
           { 'searchString': navigator.platform, 'name': 'Mac', 'subStr': 'Mac' },
           { 'searchString': navigator.platform, 'name': 'Linux', 'subStr': 'Linux' },
           { 'searchString': navigator.userAgent, 'name': 'iPhone', 'subStr': 'iPhone/iPod' }
	],
	defaultNotSupportedBrowsers: [{'os': 'Any', 'browser': 'MSIE', 'version': 7}],
	noticeText: {
    	   'professional': { "title": "Rilevazione Browser obsoleto", "notice": "Annunci.net ha rilevato che stai usando un browser obloseto: questo ti impedirà di visualizzare correttamente le pagine ed accedere a tutte le funzionalità. Anche se non obbligatorio, è fortemente consigliato procurarsi una versione più recente di uno dei browser di navigazione più diffusi.", "selectBrowser": "Clicca uno dei link sottostanti per scaricare un nuovo browser o per aggiornare il browser che usi attualmente.", "remindMeLater": "Ricordamelo più tardi", "neverRemindAgain": "No, non ricordarmelo più" },
    	   'informal': { "title": "Whoaaa!", "notice": "It appears you're using an outdated browser which prevents access to some of the features on our website. While it's not required, you really should <b>upgrade or install a new browser</b>!", "selectBrowser": "Visit the official sites for popular browsers below:", "remindMeLater": "Not now, but maybe later", "neverRemindAgain": "No, don't remind me again" },
    	   'technical': { "title": "Old Browser Alert! <span class='bd-highlight'>DEFCON 5</span>", "notice": "Come on! If you are hitting our site, then you must at least be partially tech savvy. So, why the older browser? We're not asking you to brush off your old Fibonacci Heap and share it with the class. Just upgrade!\nI know, I know. You don't like to be told what to do. But, we're only asking you to upgrade so you can access all the latest, greatest features on our site. It's quick and easy. But, if you still want to skip it, that's cool. We will still welcome you &mdash; and your creepy old browser. :P", "selectBrowser": "Visit the official sites for popular browsers below:", "remindMeLater": "Remind me later", "neverRemindAgain": "No, don't remind me. I like my Commodore 64!" },
    	   'goofy': { "title": "Are You Serious?", "notice": "Are you really using <b>{browser_name}</b> as your browser?\nYou're surfing the web on a dinosaur (a dangerous one too &mdash; like a Tyrannosaurus or Pterodactyl or something scary like that). <b>Get with it and upgrade now!</b> If you do, we promise you will enjoy our site a whole lot more. :)", "selectBrowser": "Visit the official sites for popular browsers below:", "remindMeLater": "Maybe Later", "neverRemindAgain": "No, don't remind me again" },
    	   'mean': { "title": "Umm, Your Browser Sucks!", "notice": "Get a new one here.", "selectBrowser": "Official sites for popular browsers:", "remindMeLater": "Remind me later, a'hole", "neverRemindAgain": "F' off! My browser rocks!" }
	}
};

window.onload = function(){
	BrowserDetection.init();
};;
jQuery(function($) {
    $('input[name="where"]').live('focus', function(e) {
        if (!$(this).hasClass('places-autocomplete')) {
            $(this).addClass('places-autocomplete');
            annunci_autocomplete(this);
        }
    });

    function annunci_autocomplete(elem) {
        var place_changed = false;

        var autocomplete = new google.maps.places.Autocomplete(elem, {
            types: ['(regions)'],
            componentRestrictions: {country: 'it'}
        });

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            $(elem).parents('form').find('input[name="lt"]').val(place.types[0]);
            place_changed = false;
            return true;
        });

        $(elem).change(function(e) {
            $(this).parents('form').find('input[name="lt"]').val('');
        }).keydown(function(e) {
            if (e.which == 13) {
                if ($('div.pac-container').css('display') != 'none' || place_changed) {
                    place_changed = true;
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        });

        $(elem).parents('form').submit(function(e) {
            var f = $(this);
            if (f.find('input[name="where"]').val() != '' && f.find('input[name="where"]').val() != 'Dove?' && f.find('input[name="lt"]').val() == '') {
                var geocoder = new google.maps.Geocoder();
                e.preventDefault();
                geocoder.geocode({'address': f.find('input[name="where"]').val()}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log(results);
                        f.find('input[name="where"]').val(results[0].address_components[0].long_name);
                        f.find('input[name="lt"]').val(results[0].types[0]);
                        f.submit();
                    } else {
                        alert('Devi specificare un luogo valido');
                    }
                });
            }
        });
    }
});;
// Sticky Plugin v1.0.3 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 02/14/2011
// Date: 07/20/2015
// Website: http://stickyjs.com/
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var slice = Array.prototype.slice; // save ref to original slice()
    var splice = Array.prototype.splice; // save ref to original slice()

  var defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: 'is-sticky',
      wrapperClassName: 'sticky-wrapper',
      center: false,
      getWidthFrom: '',
      widthFromWrapper: true, // works only when .getWidthFrom is empty
      responsiveWidth: false
    },
    $window = $(window),
    $document = $(document),
    sticked = [],
    windowHeight = $window.height(),
    scroller = function() {
      var scrollTop = $window.scrollTop(),
        documentHeight = $document.height(),
        dwh = documentHeight - windowHeight,
        extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

      for (var i = 0, l = sticked.length; i < l; i++) {
        var s = sticked[i],
          elementTop = s.stickyWrapper.offset().top,
          etse = elementTop - s.topSpacing - extra;

        //update height in case of dynamic content
        s.stickyWrapper.css('height', s.stickyElement.outerHeight());

        if (scrollTop <= etse) {
          if (s.currentTop !== null) {
            s.stickyElement
              .css({
                'width': '',
                'position': '',
                'top': ''
              });
            s.stickyElement.parent().removeClass(s.className);
            s.stickyElement.trigger('sticky-end', [s]);
            s.currentTop = null;
          }
        }
        else {
          var newTop = documentHeight - s.stickyElement.outerHeight()
            - s.topSpacing - s.bottomSpacing - scrollTop - extra;
          if (newTop < 0) {
            newTop = newTop + s.topSpacing;
          } else {
            newTop = s.topSpacing;
          }
          if (s.currentTop !== newTop) {
            var newWidth;
            if (s.getWidthFrom) {
                newWidth = $(s.getWidthFrom).width() || null;
            } else if (s.widthFromWrapper) {
                newWidth = s.stickyWrapper.width();
            }
            if (newWidth == null) {
                newWidth = s.stickyElement.width();
            }
            s.stickyElement
              .css('width', newWidth)
              .css('position', 'fixed')
              .css('top', newTop);

            s.stickyElement.parent().addClass(s.className);

            if (s.currentTop === null) {
              s.stickyElement.trigger('sticky-start', [s]);
            } else {
              // sticky is started but it have to be repositioned
              s.stickyElement.trigger('sticky-update', [s]);
            }

            if (s.currentTop === s.topSpacing && s.currentTop > newTop || s.currentTop === null && newTop < s.topSpacing) {
              // just reached bottom || just started to stick but bottom is already reached
              s.stickyElement.trigger('sticky-bottom-reached', [s]);
            } else if(s.currentTop !== null && newTop === s.topSpacing && s.currentTop < newTop) {
              // sticky is started && sticked at topSpacing && overflowing from top just finished
              s.stickyElement.trigger('sticky-bottom-unreached', [s]);
            }

            s.currentTop = newTop;
          }

          // Check if sticky has reached end of container and stop sticking
          var stickyWrapperContainer = s.stickyWrapper.parent();
          var unstick = (s.stickyElement.offset().top + s.stickyElement.outerHeight() >= stickyWrapperContainer.offset().top + stickyWrapperContainer.outerHeight()) && (s.stickyElement.offset().top <= s.topSpacing);

          if( unstick ) {
            s.stickyElement
              .css('position', 'absolute')
              .css('top', '')
              .css('bottom', 0);
          } else {
            s.stickyElement
              .css('position', 'fixed')
              .css('top', newTop)
              .css('bottom', '');
          }
        }
      }
    },
    resizer = function() {
      windowHeight = $window.height();

      for (var i = 0, l = sticked.length; i < l; i++) {
        var s = sticked[i];
        var newWidth = null;
        if (s.getWidthFrom) {
            if (s.responsiveWidth) {
                newWidth = $(s.getWidthFrom).width();
            }
        } else if(s.widthFromWrapper) {
            newWidth = s.stickyWrapper.width();
        }
        if (newWidth != null) {
            s.stickyElement.css('width', newWidth);
        }
      }
    },
    methods = {
      init: function(options) {
        var o = $.extend({}, defaults, options);
        return this.each(function() {
          var stickyElement = $(this);

          var stickyId = stickyElement.attr('id');
          var stickyHeight = stickyElement.outerHeight();
          var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName;
          var wrapper = $('<div></div>')
            .attr('id', wrapperId)
            .addClass(o.wrapperClassName);

          stickyElement.wrapAll(wrapper);

          var stickyWrapper = stickyElement.parent();

          if (o.center) {
            stickyWrapper.css({width:stickyElement.outerWidth(),marginLeft:"auto",marginRight:"auto"});
          }

          if (stickyElement.css("float") === "right") {
            stickyElement.css({"float":"none"}).parent().css({"float":"right"});
          }

          stickyWrapper.css('height', stickyHeight);

          o.stickyElement = stickyElement;
          o.stickyWrapper = stickyWrapper;
          o.currentTop    = null;

          sticked.push(o);
        });
      },
      update: scroller,
      unstick: function(options) {
        return this.each(function() {
          var that = this;
          var unstickyElement = $(that);

          var removeIdx = -1;
          var i = sticked.length;
          while (i-- > 0) {
            if (sticked[i].stickyElement.get(0) === that) {
                splice.call(sticked,i,1);
                removeIdx = i;
            }
          }
          if(removeIdx !== -1) {
            unstickyElement.unwrap();
            unstickyElement
              .css({
                'width': '',
                'position': '',
                'top': '',
                'float': ''
              })
            ;
          }
        });
      }
    };

  // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
  if (window.addEventListener) {
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false);
  } else if (window.attachEvent) {
    window.attachEvent('onscroll', scroller);
    window.attachEvent('onresize', resizer);
  }

  $.fn.sticky = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };

  $.fn.unstick = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.unstick.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };
  $(function() {
    setTimeout(scroller, 0);
  });
}));
;
