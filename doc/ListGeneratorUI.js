function ListGeneratorUI(){}

ListGeneratorUI.prototype = {
	inputForm:null,
	busyPanel:null,
	subscriberData:null,
	submitButton:null,
	isBusy:false,
	previousSubmitButtonText:null,
	busySavingSubmitText:'Busy',
	beforeUpdateEventHandler:function(listgenUI){
		return true;
	},
	afterPopulateEventHandler:function(listgenUI){
		return true;
	},
	initialize:function(options, done){
		
		try
		{
			if ($ == undefined)
				throw ('jquery library has not been  initialized');
			
			if (options.inputFormSelector != null)
				this.inputForm = $(options.inputFormSelector);
			else
				throw 'Please specify an input form selector';
			
			if (options.submitButtonSelector != null)
				this.submitButton = $(options.submitButtonSelector);
			else
				throw 'Please specify a submitButtonSelector';
			
			for (var optionProperty in options)
				this[optionProperty] = options[optionProperty];
			
			done();
		}
		catch(e)
		{
			done(e);
		}
		
	},
	updateFieldEvents:function(){
		
		var thisGenerator = this;
		
		this.getAllFields().each(function(){
			var field = $(this);
			
			if (field.attr('fieldType') == 'Number' || field.attr('fieldType') == 'Cellphone' || field.attr('fieldType') == 'Telephone')
				thisGenerator.numericOnlyInput(field);
			
			thisGenerator.tooltipEvents(field);
		});
	},
	validateForm:function(){
		
		var thisGenerator = this;
		var formValid = true;
		var valid = true;
		
		this.getAllFields().each(function(){
			var field = $(this);
			var fieldValid = true;
			var genericInvalidMessage = '';
			
			if (thisGenerator.isRowVisible(field.attr('fieldId')) == true)
			{
				if (field.hasClass('required'))
				{
					if (!thisGenerator.validateRequired(field))
					{
						fieldValid = false;
						formValid = false;
						
						genericInvalidMessage = 'This is a required field';
					}
				}
				
				// so required and has something in it, or not required and has something in it
				if (fieldValid && (field.val() != '' && field.val() != null))
				{
					
					
					if (field.attr('fieldType') == 'Email Address')
						if (!thisGenerator.validateEmailAddress(field))
						{
							fieldValid = false;
							formValid = false;
							
							genericInvalidMessage = 'Please enter a valid email address';
						}
					
					if (field.attr('fieldType') == 'Telephone')
						if (!thisGenerator.validateTelephone(field))
						{
							fieldValid = false;
							formValid = false;
							
							genericInvalidMessage = 'Please enter a valid telephone number of at least 10 digits';
						}
					
					if (field.attr('fieldType') == 'Cellphone')
					{
						if (!thisGenerator.validateCellphone(field))
						{
							fieldValid = false;
							formValid = false;
							
							genericInvalidMessage = 'Please enter a valid cellphone number of at least 10 digits';
						}
					}
						
					if (field.attr('fieldType') == 'Regex')
						if (!thisGenerator.validateRegex(field, decodeURIComponent(field.attr('regex'))))
						{
							fieldValid = false;
							formValid = false;
							
							genericInvalidMessage = 'This is an invalid entry';
						}
				}
			}
			
			if (!fieldValid)
				thisGenerator.validationMessage(field, field.attr('invalidMessage')==''?genericInvalidMessage:field.attr('invalidMessage'));
			
		});
		
		return formValid;
	},
	submitForm:function(action,methodType){
		
		try
		{
			if (action != null)
				this.inputForm.attr('action',action);
			
			if (methodType != null)
				this.inputForm.attr('method',methodType);
			
			if (this.isBusy == false)
			{
				this.isBusy = true;
				this.previousSubmitButtonText = this.submitButton.html();
				this.submitButton.html(this.busySavingSubmitText);
				
				if (this.validateForm())
				{
					if (this.beforeUpdateEventHandler(this))
					{
						this.updateHiddenFields();
						this.log('form submit happens now');
						this.inputForm.submit();
					}
					else
					{
						this.submitButton.html(this.previousSubmitButtonText);
						this.isBusy = false;
					}
						
				}
				else
				{
					this.submitButton.html(this.previousSubmitButtonText);
					this.isBusy = false;
				}
					
			}
		}
		catch(e)
		{
			this.log(e);
			this.submitButton.html(this.preSaveSubmitText);
		}

	},
	updateHiddenFields:function(){
		
		//we add the preset hidden fields to our form, then add all the existing fields to hidden ones with the prefix postfield_
		var thisGenerator = this;
		var inputFields = $('[fieldId]').each(function(){
		var postFieldId = 'postfield_' + $(this).attr('fieldId');
			
		var existingField = thisGenerator.inputForm.find('#' + postFieldId);
		var value = $(this).val();
		
		if ($(this).attr('type') == 'checkbox')
			value = $(this).is(':checked');
		
			if (existingField.length == 0)
			{
				thisGenerator.inputForm.append('<input  name="' + postFieldId + '" id="' + postFieldId + '" type="hidden" />');
				existingField = thisGenerator.inputForm.find('#' + postFieldId);
			}
				
			existingField.val(value);
			
		});
		
	},
	populateForm:function(){
		
		if (this.subscriberData != null)
		{
			for (var fieldId in this.subscriberData)
			{
				this.log('getting fieldId');
				this.log(fieldId);
				
				var fieldControl = this.getFieldControl(fieldId);
				
				if (fieldControl != null)
				{
					if (fieldControl.attr('type') == 'checkbox')
						fieldControl.attr('checked', this.subscriberData[fieldId]);
					else
						fieldControl.val(this.subscriberData[fieldId]);
				}
					
			}
		}
		
		if (this.afterPopulateEventHandler(this))
			this.showForm();
		
	},
	getFieldRow:function(fieldId){
		
		var returnControl = null;
		var thisGenerator = this;
		
		this.inputForm.find('[rw_fieldId]').each(function(){
			
			if ($(this).attr('rw_fieldId') == fieldId)
				returnControl = $(this);
		});
		
		return returnControl;
	},
	getFieldControl:function(fieldId){
		
		var returnControl = null;
		var thisGenerator = this;
		
		this.getAllFields().each(function(){
			
			if ($(this).attr('fieldId') == fieldId)
				returnControl = $(this);
		});
		
		return returnControl;
	},
	getAllFields:function(){
		return this.inputForm.find('[fieldId]');
	},
	showBusy:function(){
		
	},
	showForm:function(){
		
		try
		{
			this.updateFieldEvents();
		}
		catch(e)
		{
			this.log('Error happened showing form: ' + e);
		}
		
		this.inputForm.show();
	},
	getFieldHtml:function(label, controlHtml, hidden){
		var html = '<tr>\r\n';
		
		if (hidden)
			html = '<tr style=\'display:none\'>\r\n';
		
		html += '<td class="label">\r\n';
		html += label;
		
		html += '</td>\r\n';
		html += '<td class="input-container">\r\n';
		html += controlHtml;
		html += '</td>\r\n';
		html += '</tr>\r\n';
		
		return html;
	},
	prependField:function(label, controlHtml, hidden){
		this.inputForm.find('.submission-container').prepend(this.getFieldHtml(label, controlHtml, hidden));
	},
	appendField:function(label, controlHtml, hidden){
		this.inputForm.find('.submission-container').append(this.getFieldHtml(label, controlHtml, hidden));
	},
	renderDropdown:function(data, idfield, namefield, id, controlId, controlClass, controlStyle, selectedID, pleaseSelect)
	{
		//sort the data
		data = data.sort(this.dynamicSort(namefield, 'ASC'));
		
		var ddlHtml = "<select id=\"" + controlId + "\" class=\"" + controlClass + "\" style=\"" + controlStyle + "\" fieldId=\"" + id + "\">";
		var itemSelected = false;
		for (var itemIndex in data)
		{
			var itemInstance = data[itemIndex];
			
			if (selectedID == itemInstance[idfield])
			{
				ddlHtml += "<option value=\"" + itemInstance[idfield] + "\" selected>" + itemInstance[namefield] + "</option>";
				itemSelected = true;
			}
			else
				ddlHtml += "<option value=\"" + itemInstance[idfield] + "\">" + itemInstance[namefield] + "</option>";
		}
		
		if (!itemSelected && pleaseSelect)
			ddlHtml += "<option value=\"pleaseselectopt\" selected>please select</option>";
		
		ddlHtml += "</select>";
		
		return ddlHtml;
	},
	renderCheckbox:function(id, controlId, controlClass, controlStyle, isChecked){
		if (isChecked)
			return '<input fieldId="' + id + '" id="' + controlId + '" class="' + controlClass + '" type="checkbox" isChecked=true style="' + controlStyle + '" />';
		else
			return '<input fieldId="' + id + '" id="' + controlId + '" class="' + controlClass + '" type="checkbox" style="' + controlStyle + '" />';
	},
	renderInput:function(id, inputType, controlId, controlClass, controlStyle, value){
		return '<input fieldId="' + id + '" id="' + controlId + '" class="' + controlClass + '" type="' + inputType + '" value="' + value + '" style="' + controlStyle + '" />';
	},
	dynamicSort:function(property, direction) {
		
		this.log('sorting: ' + property + ' ' + direction);
		
		if (direction == "ASC")
		{
			return function (a,b) {
				return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			}
		}
		else if (direction == "DESC")
		{
			return function (a,b) {
				return (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
			}
		}
		else if (direction == "ASCNUM")
		{
			return function (a,b) {
				return (parseFloat(a[property]) < parseFloat(b[property])) ? -1 : (parseFloat(a[property]) > parseFloat(b[property])) ? 1 : 0;
			}
		}
		else if (direction == "DESCNUM")
		{
			return function (a,b) {
				return (parseFloat(a[property]) > parseFloat(b[property])) ? -1 : (parseFloat(a[property]) < parseFloat(b[property])) ? 1 : 0;
			}
		}
		else if (direction == "ASCDATE")
		{
			return function (a,b) {
				return (new Date(a[property]) < new Date(b[property])) ? -1 : (new Date(a[property]) > new Date(b[property])) ? 1 : 0;
			}
		}
		else if (direction == "DESCDATE")
		{
			return function (a,b) {
				return (new Date(a[property]) > new Date(b[property])) ? -1 : (new Date(a[property]) < new Date(b[property])) ? 1 : 0;
			}
		}
		else
		{
			return function (a,b) {
				return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			}
		}
	},
	querystring:function(key) {
		   var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
		   var r=[], m;
		   while ((m=re.exec(document.location.search)) != null) r.push(m[1]);
		   return r;
		},
	raiseError:function(e){
		this.log(e);
	},
	log:function(message){
		try
		{
			if (console != null && console != undefined)
				if (console.log != undefined)
					console.log(message);
		}
		catch(e)
		{
			//do nothing
		}
	},
	isRowVisible:function(fieldId){
		
		this.log('isRowVisible');
		this.log(fieldId);
		
		var fieldRow = this.getFieldRow(fieldId);
		
		this.log(fieldRow);
		
		if (fieldRow == null)
			return false;
		else
		{
			return fieldRow.is(':visible');
		}
			
	},
	rowVisible:function(fieldId, visible)
	{
		if (visible)
			this.getFieldRow(fieldId).show();
		else
			this.getFieldRow(fieldId).hide();
	},
	tooltipEvents:function(control)
	{
		var thisGenerator = this;
		//control.attr('title', control.attr('tooltipMessage'));

		control.tipsy({trigger: 'manual',gravity:'w'}).focusout(function() {
			//console.log('change fired');
			control.tipsy("hide");
		});

		
		if (control.attr('tooltipMessage') != '' && control.attr('tooltipMessage') != null)
			control.focus(function() {
				thisGenerator.tooltipMessage($(this), $(this).attr('tooltipMessage'), 'info', true);
			});
	},
	numericOnlyInput:function(control)
	{
		control.keydown(function(event) {
	        // Allow: backspace, delete, tab, escape, and enter
	        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
	             // Allow: Ctrl+A
	            (event.keyCode == 65 && event.ctrlKey === true) || 
	             // Allow: home, end, left, right
	            (event.keyCode >= 35 && event.keyCode <= 39)) {
	                 // let it happen, don't do anything
	                 return;
	        }
	        else {
	            // Ensure that it is a number and stop the keypress
	            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
	                event.preventDefault(); 
	            }   
	        }
	    });
	},
	validateRequired:function(control)
	{	
		if (control.hasClass('required'))
		{
			if (control.attr('type') == 'text' && (control.val() == '' || control.val() == null))
				return false;
			
			if (control.attr('type') == 'checkbox')
				return control.is(':checked');
			
			if (control.prop('type') == 'select-one')
				return (control.val() != '' && control.val() != 'please select');
				
		}
		
		return true;
	},
	validateEmailAddress:function(control)
	{		
		return this.validateRegex(control,'^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
	},
	validateRegex:function(control, expression)
	{
		return new RegExp(expression).test(control.val());
	},
	validateTelephone:function(control)
	{
		return (control.val().length >= 10 && control.val().length <= 13);
	},
	validateCellphone:function(control)
	{
		return this.validateRegex(control,'(^0[876][012346789]((\\d{7})|( |-)((\\d{3}))( |-)(\\d{4})|( |-)(\\d{7})))');
	},
	validationMessage:function(control, message)
	{
		this.tooltipMessage(control, '*' + message, 'alert', false);
	},
	tooltipMessage:function(control, message, messageType, hideOnFocusLost)
	{
		var thisGenerator = this;
		//control.attr('title',message);
		control.removeAttr('title');
		control.attr('original-title',message);
		control.tipsy("show");
		
		thisGenerator.log(control);
		thisGenerator.log('showed tooltip');
		
		if (hideOnFocusLost)
			control.focusout(function() {
				thisGenerator.hideTooltip($(this));
			});
		else
			control.focusout(function() {
				//do nothing
			});
			
	},
	hideTooltip:function(control){
		control.tipsy("hide");
	}
}