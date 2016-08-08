<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Score
 *
 * @ORM\Table(name="score")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ScoreRepository")
 */
class Score
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Challenge")
     * @ORM\JoinColumn(name="challenge_id", referencedColumnName="id")
     */
    private $idChallenge;


    /**
     * @var integer
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User")
     * @ORM\JoinColumn(name="gamer_id", referencedColumnName="id")
     */
    private $idUser;

    /**
     * @var int
     *
     * @ORM\Column(name="score", type="integer")
     */
    private $score;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set score
     *
     * @param integer $score
     * @return Score
     */
    public function setScore($score)
    {
        $this->score = $score;

        return $this;
    }

    /**
     * Get score
     *
     * @return integer 
     */
    public function getScore()
    {
        return $this->score;
    }

    /**
     * Set idChallenge
     *
     * @param \AppBundle\Entity\Challenge $idChallenge
     * @return Score
     */
    public function setIdChallenge(\AppBundle\Entity\Challenge $idChallenge = null)
    {
        $this->idChallenge = $idChallenge;

        return $this;
    }

    /**
     * Get idChallenge
     *
     * @return \AppBundle\Entity\Challenge 
     */
    public function getIdChallenge()
    {
        return $this->idChallenge;
    }

    /**
     * Set idUser
     *
     * @param \AppBundle\Entity\User $idUser
     * @return Score
     */
    public function setIdUser(\AppBundle\Entity\User $idUser = null)
    {
        $this->idUser = $idUser;

        return $this;
    }

    /**
     * Get idUser
     *
     * @return \AppBundle\Entity\User 
     */
    public function getIdUser()
    {
        return $this->idUser;
    }
}
