import { Form, Input, Button } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';

export default function Home() {
  /*
  - Grab email
  - Validate
  - Mint
  - Check Mint
  - Let user know!
  */

  const handleOnSubmit = async (e) => {
    try {
    e.preventDefault();
    let email = e.target[0].value;
    var validEmailRegex = RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
    if (validEmailRegex.test(email)){
      // mint
      Swal.fire({
        title: 'Hang tight.... Minting!',
        text: 'This screen will update when minted!',
        showConfirmButton: false,
        allowOutsideClick: false
      }
      )
      e.target.reset()
      let crossmintid;
      await fetch(`api/mint?recipient=${email}`)
      .then((response) => response.json())
      .then((responseData) => crossmintid = responseData.id)
      .catch(error => console.log('error', error));

      var status;
      await fetch(`api/check?crossmintid=${crossmintid}`)
      .then((response) => response.json())
      .then((responseData) => status = responseData.onChain.status)
      .catch(error => console.log('error', error));

      while(status == "pending"){
        await new Promise(r => setTimeout(r, 2000));
        await fetch(`api/check?crossmintid=${crossmintid}`)
        .then((response) => response.json())
        .then((responseData) => status = responseData.onChain.status)
        .catch(error => console.log('error', error));
      }
      if (status == "success"){
        // client side only 
        await emailjs.sendForm(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID, process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, e.target, process.env.NEXT_PUBLIC_EMAILJS_USER_ID)
          Swal.fire({
            title: 'NFT Minted!',
            text: `We have sent instructions on how to claim your NFT to: ${email}`,
            icon: "success",
            allowOutsideClick: false}
          )
      } else {
        Swal.fire(
          'Minting Error',
          "Error minting the NFT.\nCrossmint ID: " + crossmintid,
          'error'
        )
      }
    }
    else {
      Swal.fire(
        'Input Error',
        "Please provide a proper email.",
        'error'
      )
    }
    
  }
  catch (e) {
    console.log("General Issue.", e);
  }
  };

    return (
      <div className="App">
        <header className="App-header">
          <Image src="logo.svg" className="App-logo" alt="logo" />
          <p>
          Congrats, you have been awarded a Cinemark NFT. Enter your email below to claim it!
          </p><Form onSubmit={handleOnSubmit}>
          <Form.Field
            id='form-input-control-email'
            control={Input}
            name='user_email'
            placeholder='Email…'
            required
            icon='mail'
            iconPosition='left'
          />
          <Button type='submit' color='green'>Claim!</Button>
        </Form>
        </header>
      </div>
    );
}
