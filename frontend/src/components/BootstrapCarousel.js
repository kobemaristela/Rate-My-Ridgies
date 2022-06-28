import React from "react";
import { Carousel, Image} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "./BootstrapCarousel.css"

class BootstrapCarouselComponent extends React.Component {

    render() {
        return (
            <div className="row">
                <div className="col-8">
                    <Carousel>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://picsum.photos/500/300?img=1"
                            />
                        </Carousel.Item>

                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://picsum.photos/500/300?img=2"
                            />
                        </Carousel.Item>

                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://picsum.photos/500/300?img=3"
                            />
                        </Carousel.Item>

                    </Carousel>
                </div>
            </div>
        )
    };
}

export default BootstrapCarouselComponent;