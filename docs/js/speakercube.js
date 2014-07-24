<!-- make call to private backend API and retrieve invoices -->
$.ajax({
  type: "GET",
  url: "../speakercube/invoices",
  beforeSend: function(xhr){
       xhr.setRequestHeader('X-API-ACCESS-Token', 'leapingzebras');
  },    
})
  .fail(function( jqXHR, textStatus ) {
      console.error('Unable to retrieve backend data');
      console.log(jqXHR);
      console.log(textStatus);
  })
  .done(function( msg ) {
      console.log(msg.invoices);
      $.each(msg.invoices, function( index, value ) {
          $('#invoices tbody').append('<tr><td>' + value.id + '</td><td>' + value.date + '</td><td>' + value.value +'</td></tr>');
        console.log( value.id + ": " + value.value );
      });
  });
