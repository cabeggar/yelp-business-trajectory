package com.group7.YelpDataReader;

import org.junit.Before;
import org.junit.Test;

import java.io.IOException;

/**
 * Created by cabeggar on 12/3/16.
 */
public class ReviewReaderTest {

    private ReviewReader reviewReader;

    @Before
    public void init() {
        reviewReader = new ReviewReader("yelp_dataset_test/review.json");
    }

    @Test
    public void startReadingTest() throws IOException {
        reviewReader.startReading();
    }

}
