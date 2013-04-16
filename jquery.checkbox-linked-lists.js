(function($) {
	$.fn.checkboxLL = function(options) {
		// TODO: a 'keep sorted' option that remembers the order.
		options = $.extend({
			sortFn: function(a) {
				return $.trim(a.find('label').html());
			},
			wrap: false,
			onHeader: false,
			offHeader: false,
		}, options);

		if (this.length > 1) {
			this.each(function(_, o) {
				$(o).checkboxLL(options);
			});

			return;
		}

		if ((options.onHeader || options.offHeader) && ! options.wrap) {
			options.wrap = '<div/>';
		}

		var $on_list = $('<ul/>').addClass('on-list js-sortable'),
			$off_list = $('<ul/>').addClass('off-list js-sortable');

		this.find('>*').each(function(_, o) {
			var $this = $(this);

			var $checkbox = $this.find(':checkbox').hide();
			var $li = $('<li/>').append($this);

			if ($checkbox.is(':checked')) {
				$li.appendTo($on_list);
			}
			else {
				$li.appendTo($off_list);
			}

			$li.find('label, :checkbox').on('click', function(e) {
				e.preventDefault();
			});

			$li.on('dblclick', function() {
				var $otherlist = $checkbox.is(':checked') ? $off_list : $on_list;
				$otherlist.append($(this));
				$otherlist.sortable('refresh');

				//FIXME: This is repeated code but jQuery UI obfuscates its events
				$checkbox.prop('checked', ! $checkbox.is(':checked'));
				$otherlist.sortBy(options.sortFn);
			});
		});

		this.append($on_list);
		this.append($off_list);

		if (options.wrap) {
			$on_list.wrap($(options.wrap).addClass('on-list-wrap'));
			$off_list.wrap($(options.wrap).addClass('off-list-wrap'));
		}

		if (options.onHeader) {
			var h = $(options.onHeader);
			if (! h.length) {
				h = $('<h1>').append(options.onHeader);
			}

			$on_list.parent().prepend(h);
		}

		if (options.offHeader) {
			var h = $(options.offHeader);
			if (! h.length) {
				h = $('<h1>').append(options.offHeader);
			}

			$off_list.parent().prepend(h);
		}

		$on_list.sortable({
			connectWith: $off_list,
			receive: function(event, ui) {
				event.originalEvent.received = true;
				ui.item.find(':checkbox').prop('checked', true);
				$(this).sortBy(options.sortFn);
			},
			stop: function(event, ui) {
				if (! event.originalEvent.received) {
					$(this).sortable('cancel');
				}
			}
		});
		$off_list.sortable({
			connectWith: $on_list,
			receive: function(event, ui) {
				event.originalEvent.received = true;
				ui.item.find(':checkbox').prop('checked', false);
				$(this).sortBy(options.sortFn);
			},
			stop: function(event, ui) {
				if (! event.originalEvent.received) {
					$(this).sortable('cancel');
				}
			}
		});
	};

})(jQuery);
