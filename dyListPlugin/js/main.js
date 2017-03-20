//plugin
(function($){
	$.fn.extend({
		"addDyList" : function(options){
			var i, 
			    configs = $.extend({}, defaults, options),
			    ul = $("<ul class='dylist_ul'></ul>").appendTo(this),
			    inputbox = $("<li></li>"),
			    input = $("<input type='text'>").appendTo(inputbox),
			    menuCheck = $("<div class='dylist_menu'></div>").appendTo(this).hide(),
                spanConfirm = $("<span class='dylist_btn_confirm'>确认</span>").appendTo(menuCheck),
			    spanConcel = $("<span class='dylist_btn_cancel'>取消</span>").appendTo(menuCheck),
			    menuEdit = $("<div class='dylist_menu'></div>").appendTo(this).hide(),
			    span1, span2, span3, span4, span5;
		    span1 = $("<div class='dylist_menu'><span class='dylist_btn_edit'>编辑目录</span></div>").appendTo(this).click(function(){
				$(this).hide();
				ul.addClass('on-edit');
				ul.find("a").click(function(event){
					event.preventDefault();
				});
				menuEdit.show();
			});
		    span2 = $("<span class='dylist_btn_addDir'>添加目录</span>").appendTo(menuEdit).click(function(){
				inputbox.appendTo(ul);
				spanConfirm.click(function(){
					if(input.val() == '')
					{
						inputbox.detach();
						input.val('');
						menuCheck.hide();
						menuEdit.show();
						return;
					}
					configs.values.push(input.val());
					ul.append(newList(input.val(), configs.catagory));
					inputbox.detach();
					input.val('');
					menuCheck.hide();
					menuEdit.show();
				});
				spanConcel.click(function(){
                    inputbox.detach();
					input.val('');
					menuCheck.hide();
					menuEdit.show();
				});
				menuCheck.show();
				menuEdit.hide();
			});

		    span3 = $("<span class='dylist_btn_removeDir'>删除目录</span>").appendTo(menuEdit).click(function(){
				ul.find("input[type='checkbox']").each(function(){
					$(this).show();
				});
				spanConfirm.click(function(){
					ul.find("input[type='checkbox']:checked").each(function(){
						deleteFromArray(configs.values,$(this).siblings("a").text());
						$(this).parent().remove();
					});
					ul.find("input[type='checkbox']").each(function(){
						$(this).hide();
					});
					menuCheck.hide();
					menuEdit.show();
				});
				spanConcel.click(function(){
					ul.find("input[type='checkbox']").each(function(){
						$(this).hide();
					});
					menuCheck.hide();
					menuEdit.show();
				});
				menuCheck.show();
				menuEdit.hide();
			});

		    span4 = $("<span class='dylist_btn_changeDir'>修改目录</span>").appendTo(menuEdit).click(function(){
				ul.find('span.modify').each(function(){
					$(this).show();
				});
				spanConfirm.click(function(){
					ul.find("input[type='text']").each(function(){
						var newVal= $(this).val();
						var oldVal = $(this).parent().attr("data-za-title");
						$(this).parent().replaceWith(newList(newVal, configs.catagory));
						updateArray(configs.values, oldVal, newVal);
					});
					ul.find('span.modify').each(function(){
						$(this).hide();
					});
					menuCheck.hide();
					menuEdit.show();
				});
				spanConcel.click(function(){
					ul.find("input[type='text']").each(function(){
						var newVal= $(this).val();
						var oldVal = $(this).parent().attr("data-za-title");
						$(this).parent().replaceWith(newList(oldVal, configs.catagory));
					});
					ul.find('span.modify').each(function(){
						$(this).hide();
					});
					menuCheck.hide();
					menuEdit.show();
				});
				menuCheck.show();
				menuEdit.hide();
			});

		    span5 = $("<span class='dylist_btn_return'>返回</span>").appendTo(menuEdit).click(function(){
				configs.oneditfinished(configs.values);
				span1.show();
				menuEdit.hide();
			});

			for(i = 0; i < configs.values.length; i++){
				ul.append(newList(configs.values[i], configs.catagory));
			}
		}
	});

	var defaults = {
		'values' : [],
		'catagory' : '/',
		'oneditfinished' : function(vals){
			console.log('dylist default callback');
		}
	};

	function newList(lvalue, catagory){
		var dyli_a = $("<a href='" + catagory + "/" + lvalue + "' class='dylist_inside_a'>" + lvalue + "</a>");
		var  dyli_input = $("<input type='checkbox' class='dylist_inside_input'/>").hide();
		var dyli_span = $("<span class='modify dylist_inside_modify'>修改</span>").hide().click(function(){
			var val = $(this).siblings('a').text();
			$(this).parent().replaceWith($("<li data-za-title='"+val+"'><input class='dylist_inside_input' type='text' value='" + val + "'/></li>"));
		});
		var dyli = $("<li class='dylist_li'></li>").append(dyli_a).append(dyli_span).append(dyli_input);
		return dyli;
	};

	function deleteFromArray(array, val){
		if(!Array.isArray(array)){
			console.log('not array!');
			return;
		}
		for(var i = 0; i < array.length; i++){
			if(array[i] === val){
				array.splice(i,1);
			}
		}
	};

	function updateArray(array, oldVal, newVal){
		if(!Array.isArray(array)){
			console.log('not array!');
			return;
		}
		for(var i = 0; i < array.length; i++){
			if(array[i] === oldVal){
				array[i] = newVal;
			}
		}
	};

})(window.jQuery);
//use plugin
$(document).ready(function(){
	$('.box').addDyList({
        //初始化列表的数组
        'values' : ['HTML','CSS','JavaScript'],
        //列表中a标签的路由前缀
        'catagory' : '/catagory',
        //动态列表编辑完成之后的回掉函数，用于更新数据库
        'oneditfinished' : function(vals){
            //用动态列表中的数组vals去更新数据库的操作
            alert('数组值:'+vals);
        }
    });
});
