function ListGeneratorConfigItem(){}

ListGeneratorConfigItem.prototype = {
	name:null,
	id:null,
	controlId:null,
	type:null,
	typeConfig:null,
	required:false,
	hidden:false,
	readOnly:false,
	admin:false,
	invalidMessage:'',
	tooltipMessage:'',
	baseData:null,
	order:0,
	maxLength:null,
	defaultValue:null,
	configurator:null,
	drawn:false,
	draw:function(configurator){
		this.configurator = configurator;
		this.controlId = this.id.split(' ').join('_');
		var html = '<table class=\'field-configuration-item\' cellpadding=0 cellspacing=0>';
		
		html += '<tr class=\'listgen-header-row\'>';
		
		html += '<td  class=\'listgen-config listgen-config-cell-id-header\'>';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-name-header\'>';
		
		html += 'label';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-type-header\'>';
		
		html += 'type';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-type-config-header\' id=\'listgen-config-cell-type-config-header' + this.id + '\'>';
		
		html += 'type config';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-required-header\'>';
		
		html += 'req';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-hidden-header\'>';
		
		html += 'hid';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-readonly-header\'>';
		
		html += 'read-only';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-maxlength-header\'>';
		
		html += 'len';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-default-header\'>';
		
		html += 'default';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-invalid-msg-header\'>';
		
		html += 'invalid message';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-tooltip-msg-header\'>';
		
		html += 'tooltip message';
		
		html += '</td>';
		
		html += '</tr>';
		
		html += '<tr class=\'listgen-config-row\'>';
		
		html += '<td  class=\'listgen-config-cell-id\'>';
		
		html += '<input class=\'listgen-config-input listgen-config-id\' readOnly=\'true\' type=\'text\' fieldId=\'' + this.id + '\' id=\'id' + this.controlId + '\'></input>';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-name\'>';
		
		html += '<input class=\'listgen-config-input listgen-config-name\' type=\'text\' fieldId=\'' + this.id + '\' id=\'name' + this.controlId + '\'></input>';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-type\'>';
		
		html += '<select class=\'listgen-config-input listgen-config-type\' fieldId=\'' + this.id + '\' id=\'type' + this.controlId + '\'>';
		
		html += '<option selected>Text</option>';
		html += '<option>Email Address</option>';
		html += '<option>Number</option>';
		html += '<option>Telephone</option>';
		html += '<option>Cellphone</option>';
		html += '<option>Decimal</option>';
		html += '<option>Boolean</option>';
		html += '<option>Regex</option>';
		html += '<option>Enumeration</option>';
		
		html += '</select>';
		
		html += '</td>';
		
		html += '<td id=\'listgen-config-cell-type-config' + this.id + '\'  class=\'listgen-config-cell-type-config\'>';
		
		html += '<input class=\'listgen-config-input listgen-config-cell-type-config\' type=\'text\' fieldId=\'' + this.id  + '\' id=\'typeConfig' + this.controlId + '\'></input>';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-required\'>';
		
		html += '<input class=\'listgen-config-input listgen-config-required\' type=\'checkbox\' fieldId=\'' + this.id + '\' id=\'required' + this.controlId + '\'></input>';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-hidden\'>';
		
		html += '<input class=\'listgen-config-input listgen-config-hidden\' type=\'checkbox\' fieldId=\'' + this.id + '\' id=\'hidden' + this.controlId + '\'></input>';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-readonly\'>';
		
		html += '<input class=\'listgen-config-input listgen-config-readonly\' type=\'checkbox\' fieldId=\'' + this.id + '\' id=\'readOnly' + this.controlId + '\'></input>';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-maxlength\'>';
		
		html += '<input class=\'listgen-config-input listgen-config-maxlength\' type=\'text\' fieldId=\'' + this.id + '\' id=\'maxLength' + this.controlId + '\'></input>';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-default\'>';
		
		html += '<input class=\'listgen-config-input\' type=\'text\' fieldId=\'' + this.id + '\' id=\'defaultValue' + this.controlId + '\'></input>';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-invalid-msg\'>';
		
		html += '<textarea class=\'listgen-config-input listgen-config-invalid\' fieldId=\'' + this.id + '\' id=\'invalidMessage' + this.controlId + '\'></textarea>';
		
		html += '</td>';
		
		html += '<td  class=\'listgen-config-cell-tooltip-msg\'>';
		
		html += '<textarea class=\'listgen-config-input listgen-config-tooltip\' fieldId=\'' + this.id + '\' id=\'tooltipMessage' + this.controlId + '\'></textarea>';
		
		html += '</td>';
		
		html += '</tr>';
		
		html += '</table>';
		
		this.dom = $(html);
		this.dom.generatorItem = this;
		this.configurator.appendItem(this);
		this.drawn = true;
		this.populate();
	},
	hide:function(){
		this.dom.css('display:none');
	},
	show:function(){
		this.dom.css('display:block');
	},
	//populates the dom with the set values
	populate:function(){
		if (this.drawn == false)
			throw "You cannot populate without drawing first";
		
		for (var propertyName in this)
		{
			//console.log('populating');
			//console.log(propertyName);
			var control = this.dom.find('#' + propertyName + this.controlId);
			
			if (control.length > 0)
			{
				if (control.attr('type') == 'checkbox')
				{
					if (this[propertyName] == true || this[propertyName].toString().toLowerCase() == 'true')
						control.attr('checked', 'true');
						
				}
				else
					control.val(this[propertyName]);
			}
				

		}
	},
	dom:null,
	//updates from the dom
	getConfig:function(){
		if (this.drawn == false)
			throw "You cannot update without drawing first";
		
		var configItem = {};
		
		for (var propertyName in this)
		{
			//console.log('populating');
			//console.log(propertyName);
			var control = this.dom.find('#' + propertyName + this.controlId);
			
			if (control.length > 0)
			{
				if (control.attr('type') == 'checkbox')
					configItem[propertyName] = control.is(":checked")
				else
					configItem[propertyName] = control.val();
			}
				
		}
		
		configItem.order = this.order;
		
		return configItem;
	}
}

function ListGeneratorUIConfig(){}

ListGeneratorUIConfig.prototype = {
		uiConfigContainer:null,
		uiConfigContainerList:null,
		dataDefinition:null,
		existingConfig:null,
		dataDefinitionTransformFunction:null,
		customEventHandler:null,
		items:{},
		initialize:function(options)
		{
			if ($ == undefined)
				throw ('jquery library has not been  initialized');
			
		},
		initializeUIConfig:function(options, done)
		{
			try
			{
				this.initialize(options);
				
				if (options.containerSelector != null)
					this.uiConfigContainer = $(options.containerSelector);
				else
					throw 'Please specify a ui config container div in options, property: containerSelector';
				
				if (options.dataDefinition != null)
					this.dataDefinition = options.dataDefinition;
				else
					throw 'Please pass a data definition in with the options, property: dataDefinition';
				

				if (options.existingConfig != undefined)
					this.existingConfig = options.existingConfig;
				
				if (options.dataDefinitionTransformFunction != undefined)
					this.dataDefinitionTransformFunction = options.dataDefinitionTransformFunction;
				
				if (options.customEventHandler != undefined)
					this.customEventHandler = options.customEventHandler;
				
				this.drawConfigurationUI();
				
				done(null);
				
			}
			catch(e)
			{
				done(e);
			}
			
		},
		drawConfigurationUI:function()
		{
			//clear the container div
			this.uiConfigContainer.html('');
			
			this.uiConfigContainer.attr('class','listgen-config-container');
			
			//add our list
			this.uiConfigContainer.append('<ol class=\'listgen-config-container-list\'></ol>');
			
			this.uiConfigContainerList = this.uiConfigContainer.find('.listgen-config-container-list');
			
			//transform the data definition into the expected structure
			if (this.dataDefinitionTransformFunction != null)
				this.dataDefinition = this.dataDefinitionTransformFunction(this.dataDefinition);
			
			if (this.existingConfig != null)
				this.updateDataDefinition(this.existingConfig);
			
			//fields need to be ordered
			this.dataDefinition.fields.sort(function(a,b){
				return a.order - b.order;
			});
			
			for (var fieldIndex in this.dataDefinition.fields)
			{
				//console.log('drawing ' + this.dataDefinition.fields[fieldIndex].id);
				this.dataDefinition.fields[fieldIndex].draw(this);
			}
			
			var onDropConfigurator = this;
			
			$('.listgen-config-container-list').sortable({
				  group: 'simple_with_animation',
				  pullPlaceholder: false,
				  handle: 'i.icon-move',
				  // animation on drop
				  onDrop: function  (item, targetContainer, _super) {
				    var clonedItem = $('<li/>').css({height: 0})
				    item.before(clonedItem)
				    clonedItem.animate({'height': item.height()})
				    
				    item.animate(clonedItem.position(), function  () {
				      clonedItem.detach();
				      _super(item);
				      onDropConfigurator.updateOrders();
				    })
				  },

				  // set item relative to cursor position
				  onDragStart: function ($item, container, _super) {
				    var offset = $item.offset(),
				    pointer = container.rootGroup.pointer

				    adjustment = {
				      left: pointer.left - offset.left,
				      top: pointer.top - offset.top
				    }

				    _super($item, container)
				  },
				  onDrag: function ($item, position) {
				    $item.css({
				      left: position.left - adjustment.left,
				      top: position.top - adjustment.top
				    })
				  }
				});
			
			this.attachEvents();
			this.updateOrders();
		},
		appendItem:function(item){
			this.items[item.id] = item;
			var itemLi = $('<li class=\'listgen-config-container-listitem\' id=\'li' + item.controlId + '\' itemId=\'' + item.id + '\'><span class="move-container"><i class="icon-move"></i></span></li>');
			itemLi.append(item.dom);
			this.uiConfigContainerList.append(itemLi);
		},
		removeItem:function(item){
			this.uiConfigContainerList.find('#li' + item.controlId).remove();
		},
		attachEvents:function(){
			
			var configurator = this;
			
			$(".listgen-config-input").focus(function () {
		        $(this).previousValue = $(this).val();
		    }).change(function() {
		    	configurator.bubbleEvent('value-changed', $(this));
		    });
		},
		bubbleEvent:function(eventName, element)
		{
			//console.log(eventName + ' event happened');
			//console.log(element);
			
			if (this.customEventHandler != null)
				this.customEventHandler(eventName, element, this.handleEvent);
			else
				this.handleEvent(eventName, element);
		},
		handleEvent:function(eventName, element)
		{
			if (eventName == 'value-changed' && element.hasClass('listgen-config-type'))
			{
				if (element.val() == 'Enumeration')
				{
					$('#listgen-config-cell-enum-config' + element.fieldId).show();
					$('#listgen-config-cell-enum-config-header' + element.fieldId).show();
				}
				else
				{
					$('#listgen-config-cell-enum-config' + element.fieldId).hide();
					$('#listgen-config-cell-enum-config-header' + element.fieldId).hide();
				}
			}
		},
		getUpdatedConfiguration:function()
		{
			var config = {fields:[]}
			
			for (var itemId in this.items)
			{
				config.fields.push(this.items[itemId].getConfig());
			}
			
			return config;
		},
		updateDataDefinition:function(definition)
		{
			console.log('updating');
			
			console.log(definition);
			
			for (var fieldIndexToUpdate in this.dataDefinition.fields)
			{
				var fieldToUpdate = this.dataDefinition.fields[fieldIndexToUpdate];
				
				for (var fieldIndexToUpdateFrom in definition.fields)
				{
					var fieldToUpdateFrom = definition.fields[fieldIndexToUpdateFrom]; 
					
					if (fieldToUpdateFrom.id == fieldToUpdate.id)
					{
						for (var fieldProperty in this.dataDefinition.fields[fieldIndexToUpdate])
						{
							if (fieldToUpdateFrom[fieldProperty] != undefined)
								this.dataDefinition.fields[fieldIndexToUpdate][fieldProperty] = fieldToUpdateFrom[fieldProperty];
						}
						
					}
				}
			}
			
			console.log(this.dataDefinition);
			
		},
		updateOrders:function()
		{
			var currentOrder = 0;
			var configurator = this;
			
			this.uiConfigContainerList.find('li').each(function(){
				var connectedItem = configurator.items[$(this).attr('itemId')];
				
				if (connectedItem != undefined)
					connectedItem.order = currentOrder;
				
				currentOrder++;
			});
			/*
			var listItems = this.uiConfigContainerList.children();
			
			//console.log(listItems);
			
			for (var itemIndex in listItems)
			{
				var itemInstance = listItems[itemIndex];
				//console.log(itemInstance);
				//console.log($(itemInstance).attr('itemId'));
				
				var connectedItem = this.items[$(itemInstance).attr('itemId')];
				
				if (connectedItem != undefined)
					connectedItem.order = currentOrder;
				
				currentOrder++;
			}
			*/
		}
}