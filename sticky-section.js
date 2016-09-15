/* Based on Nalinda's plugin */

define([
    'jquery',
    'underscore',
    'utility',
    'jquery/ui'
], function ($, _, utility) {
    "use strict";

    $.widget('drgz.stickySection', {
        options: {
            stickyfrom: 0, // additional space before it come to top of the page
            desktopOnly: true, //only add the sticky in desktop
            topOffset: 0,
            stickyFromItemSelector: null,
            stickyToItemSelector: null,
            throttle: false,
            hideItem: '.product-title-container',
            extraGapTop: 0,
            initialExtraGapTop: 0
        },

        _create: function () {
            var self = this;

            self.stickyFrom = $(self.options.stickyFromItemSelector).length ? $(self.options.stickyFromItemSelector) : self.element.parent();
            self.stickyTo = $(self.options.stickyToItemSelector);

            self.options.initialExtraGapTop = self.options.extraGapTop;

            self.element.addClass('sticky-element');

            this._callSticky();
        },

        // desktop: function () {
        //     this._callSticky();
        //
        // },
        //
        // mobile: function () {
        //     this.destroySticky();
        // },

        _callSticky: function () {
            var self = this;

            var onScroll = self.options.throttle ?
                _.throttle(function () {
                    self._placeSticky();
                }, 100) :
                function () {
                    self._placeSticky();
                };

            $(window).on('scroll.ns', onScroll);

        },
        // destroySticky: function () {
        //     $(window).off('scroll.ns');
        // },

        _placeSticky: function () {

            var self = this;

            if (self.element.is(':hidden')) {
                return;
            }
            if (self.options.desktopOnly && utility.isMobile()) {
                return;
            }

            var scrollTop = $(window).scrollTop() + self.options.topOffset;
            var parentTop = self.stickyFrom.offset().top;
            var parentBottom = self.stickyTo.length ? self.stickyTo.offset().top : (self.stickyFrom.offset().top + self.stickyFrom.height());

            var elementHeight =  self.element.outerHeight(true);

            self.element.css('position', 'relative');

            if (scrollTop < parentTop) {
                self._setPosition(0, self.options.throttle);
            }
            if (scrollTop > parentTop && scrollTop < parentBottom - elementHeight - self.options.extraGapTop) {
                var topValForCenterRange = scrollTop - parentTop + self.options.extraGapTop + self.options.initialExtraGapTop;
                self._setPosition(topValForCenterRange > 0  ? topValForCenterRange : 0, self.options.throttle);
            }
            if (scrollTop > parentBottom - elementHeight - self.options.extraGapTop) {
                var topValForBottomPos = parentBottom - parentTop - elementHeight;
                self._setPosition(topValForBottomPos > 0 ? topValForBottomPos : 0, self.options.throttle);
            }

        },

        _setPosition: function (value, throttle) {
            var self = this;

            if (throttle) {
                self.element.stop().animate({top: value}, 300);
            } else {
                self.element.css('top', value + 'px');
            }
        }
    });

    return $.drgz.stickySection;
});
