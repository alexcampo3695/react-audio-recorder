import UIKit
import WebKit

class ViewController: UIViewController {
    var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Initialize the WKWebView and set its frame to the view's frame
        webView = WKWebView(frame: self.view.frame)
        
        // Add the WKWebView as a subview to the main view
        self.view.addSubview(webView)
        
        // Use the correct local IP address and port number
        let localIPAddress = "10.10.0.14"  // Your computer's IP address
        let port = 4175
        let urlString = "http://\(localIPAddress):\(port)"
        if let url = URL(string: urlString) {
            let request = URLRequest(url: url)
            webView.load(request)
        } else {
            print("Error: Invalid URL")
        }
    }
}
